import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UsersDAO from '../dao/usersDAO';

const hashPassword = async (password) => await bcrypt.hash(password, 10);

/**
 * user single data class
 */
export class User {
  /**
   * user class initializer
   * @param {name} name - user name
   * @param {email} email - user email
   * @param {password} password - user password
   * @param {preferences} preferences - user preferences
   */
  constructor({name, email, password, preferences = {}} = {}) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.preferences = preferences;
  }
  /**
   * put data in json for jwt except password
   * @return {json} - return json data to encode to jwt
   */
  toJson() {
    return {name: this.name, email: this.email, preferences: this.preferences};
  }
  /**
   * compare user password if correct
   * @param {plainText} plainText
   */
  async comparePassword(plainText) {
    return await bcrypt.compare(plainText, this.password);
  }
  /**
   * encode json data to jwt token
   * @return {jwtToken} - create and return jwt token
   */
  encoded() {
    return jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 4,
          ...this.toJson(),
        },
        process.env.SECRET_KEY,
    );
  }
  /**
   * decode jwt token to json data  like toJson data
   * @param {userJwt} userJwt - jwt token
   * @return {userClass} - user single data class
   */
  static async decoded(userJwt) {
    return jwt.verify(userJwt, process.env.SECRET_KEY, (error, res) => {
      if (error) {
        return {error};
      }
      return new User(res);
    });
  }
}

/**
 * user controller class
 */
export default class UserController {
  /**
   * user register
   * @param {req} req
   * @param {res} res
   */
  static async register(req, res) {
    try {
      const userFromBody = req.body;
      const errors = {};
      if (userFromBody && userFromBody.password.length < 8) {
        errors.password = 'Your password must be at least 8 characters.';
      }
      if (userFromBody && userFromBody.name.length < 3) {
        errors.name = 'You must specify a name of at least 3 characters.';
      }

      if (Object.keys(errors).length > 0) {
        res.status(400).json(errors);
        return;
      }

      const userInfo = {
        ...userFromBody,
        password: await hashPassword(userFromBody.password),
      };

      const insertResult = await UsersDAO.addUser(userInfo);
      if (!insertResult.success) {
        errors.email = insertResult.error;
      }
      const userFromDB = await UsersDAO.getUser(userFromBody.email);
      if (!userFromDB) {
        errors.general = 'Internal error, please try again later';
      }

      if (Object.keys(errors).length > 0) {
        res.status(400).json(errors);
        return;
      }

      const user = new User(userFromDB);
      // eslint-disable-next-line no-unused-vars
      const userObj = await User.decoded(user.encoded());
      res.json({
        auth_token: user.encoded(),
        info: user.toJson(),
      });
    } catch (e) {
      res.status(500).json({error: e});
    }
  }

  /**
   * user login function to check user if allow
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static async login(req, res, next) {
    try {
      const {email, password} = req.body;
      if (!email || typeof email !== 'string') {
        res.status(400).json({error: 'Bad email format, expected string.'});
        return;
      }
      if (!password || typeof password !== 'string') {
        res.status(400).json({error: 'Bad password format, expected string.'});
        return;
      }
      const userData = await UsersDAO.getUser(email);
      if (!userData) {
        res.status(401).json({error: 'Make sure your email is correct.'});
        return;
      }
      const user = new User(userData);

      if (!(await user.comparePassword(password))) {
        res.status(401).json({error: 'Make sure your password is correct.'});
        return;
      }

      const loginResponse = await UsersDAO.loginUser(user.email, user.encoded());
      if (!loginResponse.success) {
        res.status(500).json({error: loginResponse.error});
        return;
      }
      res.json({auth_token: user.encoded(), info: user.toJson()});
    } catch (e) {
      res.status(400).json({error: e});
      return;
    }
  }

  /**
   * user logour function
   * @param {*} req
   * @param {*} res
   */
  static async logout(req, res) {
    try {
      const userJwt = req.get('Authorization').slice('Bearer '.length);
      const userObj = await User.decoded(userJwt);
      const {error} = userObj;
      if (error) {
        res.status(401).json({error});
        return;
      }
      const logoutResult = await UsersDAO.logoutUser(userObj.email);
      const {err} = logoutResult;
      if (err) {
        res.status(500).json({error});
        return;
      }
      res.json(logoutResult);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  /**
   * delete user
   * @param {req} req
   * @param {res} res
   */
  static async delete(req, res) {
    try {
      const {password} = req.body;
      if (!password || typeof password !== 'string') {
        res.status(400).json({error: 'Bad password format, expected string.'});
        return;
      }
      const userJwt = req.get('Authorization').slice('Bearer '.length);
      const userClaim = await User.decoded(userJwt);
      const {error} = userClaim;
      if (error) {
        res.status(401).json({error});
        return;
      }
      const user = new User(await UsersDAO.getUser(userClaim.email));
      if (!(await user.comparePassword(password))) {
        res.status(401).json({error: 'Make sure your password is correct.'});
        return;
      }
      const deleteResult = await UsersDAO.deleteUser(userClaim.email);
      const {err} = deleteResult;
      if (err) {
        res.status(500).json({error});
        return;
      }
      res.json(deleteResult);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  /**
   * update user's preference
   * @param {req} req
   * @param {res} res
   */
  static async save(req, res) {
    try {
      const userJwt = req.get('Authorization').slice('Bearer '.length);
      const userFromHeader = await User.decoded(userJwt);
      const {error} = userFromHeader;
      if (error) {
        res.status(401).json({error});
        return;
      }

      await UsersDAO.updatePreferences(
          userFromHeader.email,
          req.body.preferences,
      );
      const userFromDB = await UsersDAO.getUser(userFromHeader.email);
      const updatedUser = new User(userFromDB);

      res.json({
        auth_token: updatedUser.encoded(),
        info: updatedUser.toJson(),
      });
    } catch (e) {
      res.status(500).json(e);
    }
  }

  /**
   * create admin user
   * for internal use only
   * @param {req} req
   * @param {res} res
   */
  static async createAdminUser(req, res) {
    try {
      const userFromBody = req.body;
      const errors = {};
      if (userFromBody && userFromBody.password.length < 8) {
        errors.password = 'Your password must be at least 8 characters.';
      }
      if (userFromBody && userFromBody.name.length < 3) {
        errors.name = 'You must specify a name of at least 3 characters.';
      }

      if (Object.keys(errors).length > 0) {
        res.status(400).json(errors);
        return;
      }

      const userInfo = {
        ...userFromBody,
        password: await hashPassword(userFromBody.password),
      };

      const insertResult = await UsersDAO.addUser(userInfo);
      if (!insertResult.success) {
        errors.email = insertResult.error;
      }

      if (Object.keys(errors).length > 0) {
        res.status(400).json(errors);
        return;
      }

      // eslint-disable-next-line no-unused-vars
      const makeAdminResponse = await UsersDAO.makeAdmin(userFromBody.email);

      const userFromDB = await UsersDAO.getUser(userFromBody.email);
      if (!userFromDB) {
        errors.general = 'Internal error, please try again later';
      }

      if (Object.keys(errors).length > 0) {
        res.status(400).json(errors);
        return;
      }

      const user = new User(userFromDB);
      const jwt = user.encoded();
      // eslint-disable-next-line no-unused-vars
      const loginResponse = await UsersDAO.loginUser(user.email, jwt);

      res.json({
        auth_token: jwt,
        info: user.toJson(),
      });
    } catch (e) {
      res.status(500).json(e);
    }
  }
}
