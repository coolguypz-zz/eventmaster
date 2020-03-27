

function ifExist(array,item,qty) {
  var found = array.some(v => v.item.id == item.item.id);

  if(found){
    return array.forEach(v => {
      if(v.item.id == item.item.id){
        v.qty+=qty;
      }
    })
  }else{
    return array.push(item);
  }
}