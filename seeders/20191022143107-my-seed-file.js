'use strict'
const bcrypt = require('bcrypt-nodejs')
const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert(
      'Users',
      [
        {
          name: `root`,
          email: `root@example.com`,
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          role: true,
          phone: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          birthday: faker.date.past(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ].concat(
        Array.from({ length: 4 }).map((d, index) => ({
          name: `user${index + 1}`,
          email: `user${index + 1}@example.com`,
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          role: false,
          phone: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          birthday: faker.date.past(),
          createdAt: new Date(),
          updatedAt: new Date()
        }))
      ),
      {}
    )
    queryInterface.bulkInsert(
      'ShippingAddresses',
      Array.from({ length: 10 }).map(d => ({
        name: faker.name.findName(),
        phone: faker.phone.phoneNumber(),
        address: faker.address.streetAddress(),
        UserId: Math.floor(Math.random() * 5) + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    )
    queryInterface.bulkInsert(
      'Products',
      Array.from({ length: 10 }).map(d => ({
        name: faker.lorem.word(),
        description: faker.lorem.text(),
        price: faker.random.number(),
        image: faker.image.food(),
        CategoryId: Math.floor(Math.random() * 3) + 1,
        stock: faker.random.number(),
        stock_warning: faker.random.number(),
        createdAt: new Date(),
        updatedAt: new Date(),
        available: '1',
        rating: 0
      })),
      {}
    )
    queryInterface.bulkInsert(
      'Categories',
      Array.from({ length: 3 }).map(d => ({
        name: faker.lorem.word(),
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    )
    queryInterface.bulkInsert(
      'Coupons',
      Array.from({ length: 3 }).map(d => ({
        code: faker.lorem.word(),
        start_date: faker.date.past(),
        end_date: faker.date.future(),
        DiscountId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    )
    queryInterface.bulkInsert(
      'Discounts',
      [
        {
          description: '% off',
          limit: 40,
          figure: 40,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    )
    queryInterface.bulkInsert(
      'Carts',
      Array.from({ length: 10 }).map(d => ({
        name: 'cart',
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    )
    queryInterface.bulkInsert(
      'UserCoupons',
      [
        {
          UserId: 1,
          CouponId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          UserId: 2,
          CouponId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          UserId: 2,
          CouponId: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          UserId: 3,
          CouponId: 3,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          UserId: 4,
          CouponId: 3,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    )
    return queryInterface.bulkInsert(
      'CartItems',
      Array.from({ length: 10 }).map((d, index) => ({
        quantity: Math.floor(Math.random() * 10) + 1,
        ice: index > 4 ? '去冰' : '正常冰',
        sugar: index > 4 ? '半糖' : '無糖',
        CartId: Math.floor(Math.random() * 10) + 1,
        ProductId: Math.floor(Math.random() * 10) + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    )
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Users', null, {})
    queryInterface.bulkDelete('ShippingAddresses', null, {})
    queryInterface.bulkDelete('Categories', null, {})
    queryInterface.bulkDelete('Products', null, {})
    queryInterface.bulkDelete('Coupons', null, {})
    queryInterface.bulkDelete('Discounts', null, {})
    queryInterface.bulkDelete('Carts', null, {})
    queryInterface.bulkDelete('UserCoupons', null, {})
    queryInterface.bulkDelete('Products', null, {})
    return queryInterface.bulkDelete('CartItems', null, {})
  }
}
