module.exports = (sortKey, sortValue, sortOption) => {
  if (sortKey === 'price' && sortValue === 'DESC')
    return (displaySort = '價格(高到低)')
  else if (sortKey === 'price' && sortValue === 'ASC')
    return (displaySort = '價格(低到高)')
  else if (sortKey === 'rating' && sortValue === 'DESC')
    return (displaySort = '評價(高到低))')
  else if (sortKey === 'rating' && sortValue === 'ASC')
    return (displaySort = '評價(低到高)')
}
