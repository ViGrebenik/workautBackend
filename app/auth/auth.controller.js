import { faker } from '@faker-js/faker'
import { hash, verify } from 'argon2'
import asyncHandler from 'express-async-handler'

import { prisma } from '../prisma.js'

import { generateToken } from './generate-token.js'
import { UserFields } from '../utils/user.utils.js'

export const authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body
	const user = await prisma.user.findUnique({
		where: {
			email
		}
	})

	if (user) {
		const isValidPassword = await verify(user.password, password)
		if (isValidPassword) {
			const token = generateToken(user.id)
			res.json({ user, token })
		} else {
			res.status(401)
			throw new Error('Email and password are not correct')
		}
	} else {
		res.status(401)
		throw new Error('User not found')
	}
})

export const registerUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body

	const isHAveUser = await prisma.user.findUnique({
		where: {
			email
		}
	})

	if (isHAveUser) {
		res.status(400)
		throw new Error('User already exists')
	}

	const user = await prisma.user.create({
		data: {
			email,
			password: await hash(password),
			name: faker.person.firstName()
		},
		select: UserFields
	})

	const token = generateToken(user.id)

	res.json({ user, token })
})
