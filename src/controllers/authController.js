import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Administrador from "../models/Administrador.js";
import Motorista from "../models/Motorista.js";

class authController {
  async login(req, res) {
    try {
      const { email, senha } = req.body;

      let role = null;
      let usuario = null;


      usuario = await Administrador.findOne({
        where: {
          Email: email,
        },
      });
      if (usuario) {
        role = "administrador";
      } else {
        usuario = await Motorista.findOne({
          where: {
            Email: email,
          },
        });
        if (usuario) {
          role = "motorista";
        }
      }
      if (!usuario) {
        return res.status(401).json({ mensagem: "Email ou senha inválidos" });
      }


      const senhaValida = bcrypt.compareSync(senha, usuario.Senha);
      if (!senhaValida) {
        return res.status(401).json({ mensagem: "Email ou senha inválidos" });
      }


      const token = jwt.sign(
        {
          id: usuario.AdministradorId || usuario.MotoristaId,
          email: usuario.Email,
          role: role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "12h" }
      );


      return res.json({
        mensagem: "Login realizado com sucesso",
        token,
        usuario: {
          ...usuario.get({ plain: true }),
          Senha: null,
          role,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ mensagem: "Erro no servidor" });
    }
  }
}

export default new authController;
