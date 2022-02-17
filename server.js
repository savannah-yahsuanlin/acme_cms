const {Sequelize, DataTypes} = require('sequelize')
const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_cms')


const Page = db.define('pages', {
	id: {
		type: DataTypes.UUID,
		primaryKey: true,
		defaultValue: DataTypes.UUIDV4
	},
	name: {
		type: DataTypes.STRING
	}
})

const Content = db.define('contents', {
	id: {
		type: DataTypes.UUID,
		primaryKey: true,
		defaultValue: DataTypes.UUIDV4
	},
	name: {
		type: DataTypes.STRING
	}
})


const Placement = db.define('placements ', {
	id: {
		type: DataTypes.UUID,
		primaryKey: true,
		defaultValue: DataTypes.UUIDV4
	},
	name: {
		type: DataTypes.STRING
	}
})

Page.belongsTo(Page, {as: 'parent' })

Placement.belongsTo(Content)
Placement.belongsTo(Page)

const seedAndSync = async(req, res, next) => {
	try {
		await db.sync({force: true})

		const home = await Page.create({name: 'home'})
		const about = await Page.create({name: 'about', parentId: home.id})
		const contact = await Page.create({name: 'contact', parentId: home.id})
		const tbd = await Page.create({name: 'tbd', parentId: contact.id})

		const welcome = await Content.create({name: 'welcome'})
		const footer = await Content.create({name: 'footer'})
		const form = await Content.create({name: 'form'})
		const bios = await Content.create({name: 'bios'})
		const emails = await Content.create({name: 'emails'})
		const header = await Content.create({name: 'header'})

		await Placement.create({pageId: home.id, contactId: welcome.id})
	}
	catch(ex) {
		next(ex)
	}
}


const setUp = async() => {
	try {
		await db.authenticate()
		await seedAndSync()
	}
	catch(ex) {
		console.log(ex)
	}
} 

setUp()