window.onload = function() {
  const catTitles = document.getElementsByClassName('cat-title')
  // console.log(catTitle)
  for (let catTitle of catTitles) {
    if (catTitle.nextElementSibling.nextElementSibling.innerText === '') {
      catTitle.classList.add('d-none')
      catTitle.nextElementSibling.classList.add('d-none')
    }
  }
}
window.onload()
