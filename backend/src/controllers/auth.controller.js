import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser } from '../models/user.model.js';

export const registerUser = async (request, response) => {
  try {
    
    const { name, email, password } = request.body;

    const isMissingRequiredFields = !name || !email || !password;

    if (isMissingRequiredFields) {
      return response.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
    }


    const existingUser = await findUserByEmail(email);
    const isEmailAlreadyRegistered = existingUser !== null;

    if (isEmailAlreadyRegistered) {
      return response.status(409).json({ error: 'Este email já está em uso.' });
    }


    const encryptionSaltRounds = 10;
    const securelyHashedPassword = await bcrypt.hash(password, encryptionSaltRounds);

    const createdUser = await createUser({
      name,
      email,
      password: securelyHashedPassword
    });

    return response.status(201).json(createdUser);
  
  } catch (serverError) {
    return response.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

export const loginUser = async (request, response) => {
  try {
    const { email, password } = request.body;

    const isMissingCredentials = !email || !password;
    if(isMissingCredentials) {
      return response.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    const user = await findUserByEmail(email);
    const userNotFound = user === null;
    if(userNotFound) {
      return response.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if(!isPasswordCorrect) {
      return response.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const tokenPayload = { id: user.id };
    const secretKey = process.env.JWT_SECRET;
    const tokenOptions = { expiresIn: '1d' };

    const authenticationToken = jwt.sign(tokenPayload, secretKey, tokenOptions);

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email
    }

    return response.status(200).json({
      user: userResponse,
      token: authenticationToken
    })


  } catch(serverError) {
    return response.status(500).json({error: 'Erro interno do servidor.'});
  }
};