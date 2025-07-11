import createError from 'http-errors'
import  Product from '../models/Products.js'

export async function indexNew(req, res, next) {
  res.render('newProduct')
}



export async function postNew(req, res, next) {
  
  try {
    
    const userId = req.session.userId
    const {name, price, tags} = req.body

    const product = new Product({
      name,
      price,
      tags,
      image: req.file.filename,
      owner: userId
    });
    
    product.tags = product.tags?.filter(tag => !!tag)
    
  
    const savedProduct = await product.save()
    
    res.redirect('/');
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export async function deleteOne(req, res, next) {
  try {
    const userId = req.session.userId
    const productId = req.params.productId

  
    const product = await Product.findOne({ _id: productId })


    if (!product) {
      console.warn(`WARNING - el usuario ${userId} intentó eliminar un producto que no existe (${productId})`)
      return next(createError(404, 'Not found'))
    }

  
    if (product.owner.toString() !== userId) {
      console.warn(`WARNING - el usuario ${userId} intentó eliminar un producto (${productId}) propiedad de otro usuario (${product.owner})`)
      return next(createError(401, 'No autorizado'))
    }

    await Product.deleteOne({ _id: productId })

    res.redirect('/')

  } catch (error) {
    next(error)
  }
}

export async function getOne(req, res, next) {
   try {
    const userId = req.session.userId
    const productId = req.params.productId

  
    const product = await Product.findOne({ _id: productId })


    if (!product) {
      console.warn(`WARNING - el usuario ${userId} intentó encontrar un producto que no existe (${productId})`)
      return next(createError(404, 'Not found'))
    }

    res.locals.product = product
    res.render('productDetail')

    } catch (error) {
    next(error)
    }
}