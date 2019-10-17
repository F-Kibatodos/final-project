const productController = {
  getProducts: (req, res) => {
    res.render('admin/products')
  },
  createProducts: (req, res) => {
    res.render('admin/createProducts')
  },
  editProduct: (req, res) => {
    res.render('admin/editProduct')
  },
  createProduct: (req, res) => {
    // 新增商品
  },
  putProduct: (req, res) => {
    // 修改商品
  },
  deleteProduct: (req, res) => {
    // 刪除商品
  }
}

module.exports = productController
