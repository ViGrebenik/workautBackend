import expressAsyncHandler from 'express-async-handler'
import { UserFields } from '../utils/user.utils.js'
import { prisma } from '../prisma.js'

export const getUserProfile = expressAsyncHandler(async (req, res) => {
	const user = await prisma.user.findUnique({
		where: {
			// id: req.user.id
			id: 1
		},
		select: UserFields
	})

	res.json(user)
})
