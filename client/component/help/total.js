
function totalQty(array){
  var sumQty = 0;
  array.forEach(v =>{
    if(v.qty){
      sumQty += v.qty;
    }
  })
  return sumQty;
}

function totalPrice(array){
  var sumPrice = 0;
  array.forEach(v => {
    if(v.price && v.qty){
      var singleItem = v.price * v.qty;
      sumPrice += singleItem;
    }
  })
  return sumPrice.toFixed(2);
}