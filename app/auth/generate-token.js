import Jwt from 'jsonwebtoken'

export const generateToken = userId =>
	Jwt.sign(
		{
			userId
		},
		process.env.JWT_SECRET,
		{
			expiresIn: '10d'
		}
	)
