import jwt from "jsonwebtoken";
export default function authorize(roles = []) {
  return (req, res, next) => {
    try {      
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).json({ mensagem: "Token não fornecido" });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //console.log(decoded.role);
      //console.log(roles);
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ mensagem: "Sem permissão para acessar este recurso" });
      }

      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ mensagem: "Token inválido" });
    }
  };
}
