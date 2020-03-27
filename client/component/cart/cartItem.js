

class CartItem {
  constructor(data, callbacks) {

    this.handleDelete = this.handleDelete.bind(this);

    this.dom = {

    };
    this.data = data;
    this.callbacks = callbacks;
  }

  renderCartItem() {
    var row = this.dom.row = $("<div>",{
      class:"row row-border",
    })
    var [hightRatioImg] = this.data.item.images.filter(v => {
      if(v.width == 2048){
        return v.url;
      }
    })
    var imgDiv = $("<div>",{
      class:"col",
    })
    var img = $("<img>",{
      class: "cartImg",
      src:hightRatioImg.url,
    })
    imgDiv.append(img);

    var name = $("<div>",{
      class:"col",
      text:this.data.item.name,
    })

    var eventDate = $("<div>",{
      class:"col",
    })
    var date = $("<div>",{
      class:"col",
      text:this.data.item.dates.start.localDate
    })
    var time = $("<div>",{
      class:"col",
      text:this.data.item.dates.start.localTime
    })
    eventDate.append(date,time);

    var qty = $("<div>",{
      class:"col",
      text:this.data.qty,
    })
    var price = $("<div>",{
      class:"col",
      text: `$${this.data.price.toFixed(2)}`
    })
    var buttonDiv = $("<div>",{
      class:"col",
    })
    var button = $("<div>",{
      class:"btn btn-danger p-2 delbtn",
      text:"DELETE",
      click:this.handleDelete,
    })
    buttonDiv.append(button);

    row.append(imgDiv,name,eventDate,qty,price,buttonDiv);

    return row;
  }
  handleDelete(e){
    if(e) e.preventDefault();
    this.callbacks.del(this);
  }
}