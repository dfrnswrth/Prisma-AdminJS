import AdminJS from 'adminjs'
import AdminJSKoa from '@adminjs/koa'
import * as AdminJSPrisma from '@adminjs/prisma'
import Koa from 'koa'
import { prisma } from 'database'
import { type DMMFClass } from 'database'


const PORT = 3000

AdminJS.registerAdapter({
  Resource: AdminJSPrisma.Resource,
  Database: AdminJSPrisma.Database,
})

const start = async () => {
  const dmmf = ((prisma as any)._baseDmmf as DMMFClass)
  // const dmmf = await (prisma as any)._getDmmf() as DMMFClass

  const adminOptions = {
    // We pass Publisher to `resources`
    resources: [{
      resource: { model: dmmf.modelMap.Foo, client: prisma },
      options: {},
    }, {
      resource: { model: dmmf.modelMap.Bar, client: prisma },
      options: {},
    }, {
      resource: { model: dmmf.modelMap.Many1, client: prisma },
      options: {},
    }, {
      resource: { model: dmmf.modelMap.Many2, client: prisma },
      options: {},
    }],
    rootPath: '/admin',
  }

  const app = new Koa()
  const admin = new AdminJS(adminOptions)

  const router = AdminJSKoa.buildRouter(admin, app)

  app
    .use(router.routes())
    .use(router.allowedMethods())

   app.listen(PORT, () => {
     console.log(`AdminJS available at http://localhost:${PORT}${admin.options.rootPath}`)
   })
}

start()