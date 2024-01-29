import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'

import router from './app/auth/auth.routes.js'
import { prisma } from './app/prisma.js'

const app = express()

dotenv.config()

async function main() {
	const PORT = process.env.PORT || 5000

	if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

	app.use(express.json())
	app.use('/api/auth', router)

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
