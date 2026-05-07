import jwt from 'jsonwebtoken';

export const requireAuth = (request, response, next) => {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader) {
    return response.status(401).json({ error: 'Token não fornecido.' });
  }

  const tokenParts = authorizationHeader.split(' ');
  const isBearerFormatValid = tokenParts.length === 2 && tokenParts[0] === 'Bearer';

  if (!isBearerFormatValid) {
    return response.status(401).json({ error: 'Formato de token inválido.' });
  }

  const token = tokenParts[1];

  try {
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
    
    request.userId = decodedPayload.id; 
    
    return next();

  } catch (invalidTokenError) {
    return response.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};
