import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import path from 'path'

import { errorHandler, notFound } from './app/middleware/error.middleware.js'

import authRouter from './app/auth/auth.routes.js'
import exerciseRoutes from './app/exercise/exercise.routes.js'
import userRoutes from './app/user/user.routes.js'
import workoutsRoutes from './app/workout/workout.routes.js'

import { prisma } from './app/prisma.js'

dotenv.config()

const app = express()

async function main() {
	if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))
	const PORT = process.env.PORT || 5000

	app.use(express.json())

	const __dirname = path.resolve()
	app.use('/uploads', express.static(path.join(__dirname, './uploads/')))
	app.use(cors())
	app.use('/api/auth', authRouter)
	app.use('/api/users', userRoutes)
	app.use('/api/exercises', exerciseRoutes)
	app.use('/api/workouts', workoutsRoutes)

	app.use(notFound)
	app.use(errorHandler)

	app.listen(
		PORT,
		console.log(`Server run in ${process.env.NODE_ENV} mode on port ${PORT}`)
	)
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async e => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
