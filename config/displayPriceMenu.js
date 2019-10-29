module.exports = price => {
  if (price === '0,30') return (price = '30元以下')
  else if (price === '31,40') return (price = '31-40元')
  else if (price === '41,50') return (price = '41-50元')
  else if (price === '51,60') return (price = '51-60元')
  else if (price === '61,100') return (price = '60元以上')
}
