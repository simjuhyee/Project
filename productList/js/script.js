 // 상단 카운트 배너
 let countNum = 15
 let cpnCount = setInterval(() => {
   document.querySelector('.header__banner--num').innerText = countNum
   countNum--
   if(countNum == 0){
     document.querySelector('.header__banner').classList.add('hide')
     clearInterval(cpnCount);
   }
 }, 1000);



 window.onload = function(){
//  json data get
  var cartPrd = []
  var prdList = document.querySelector('.product__list')
  $.get('./js/store.json').done((data) => {

    var products = data.products
    let prCount = data.products.length;

    document.querySelector('.product__total > .num').innerText = prCount;
    products.forEach(item => {
      prdList.insertAdjacentHTML('afterbegin', `
          <li class="product__item">
            <div class="product__thumb">
              <img src="./img/${item.photo}" alt="">
              <div class="product__item-btns">
                  <button class="product__btn product__btn--cart" data-id=${item.id}><span class="blind">장바구니에 담기</span></button>
              </div>
            </div>
            <div class="product__info">
              <span class="product__info--brand">${item.brand}</span>
              <p class="product__info--title">${item.title}</p>
              <div class="product__info--star">
                <div class="star star${item.star}"><span class="blind">5점</span></div>
              </div>
              <p class="product__info--price"><span class="sale">${item.sale}%</span> <span class="price">${item.price}</span> 원</p>
              <div class="product__tag">
              </div>
            </div>
          </li>
        `)
        comma();
        });

        for(let i = 0; i < prCount; i++) {
          products[i]['tag'].forEach(item => {
            document.querySelectorAll('.product__tag')[i].insertAdjacentHTML(
              'afterbegin', `
              <span class="tag ${item}"></span>
              `
            )
          })
        }
        // 검색 필터
        var search = document.querySelector('.header__search--input')
        search.addEventListener('keyup', function(){

          var keyword = search.value;
          var searchPrd = products.filter(item => {
            return item.title.includes(keyword) || item.brand.includes(keyword)
          })
          prdList.innerHTML = ''
          searchPrd.forEach(item => {
            prdList.insertAdjacentHTML('afterbegin', `
            <li class="product__item">
            <div class="product__thumb type02">
              <img src="./img/${item.photo}" alt="">
            </div>
            <div class="product__info">
              <span class="product__info--brand">${item.brand}</span>
              <p class="product__info--title">${item.title}</p>
              <div class="product__info--star">
               <div class="star star${item.star}"><span class="blind">5점</span></div>
              </div>
              <p class="product__info--price"><span class="sale">${item.sale}%</span> <span class="price">${item.price}</span>원</p>
              <div class="product__tag">
              </div>
            </div>
          </li>
            `)
          })

          document.querySelector('.product__total > .num').innerText = searchPrd.length;

          for(let i = 0; i < searchPrd.length; i++) {
            searchPrd[i]['tag'].forEach(item => {
              document.querySelectorAll('.product__tag')[i].insertAdjacentHTML(
                'afterbegin', `
                <span class="tag ${item}"></span>
                `
              )
            })
          }

          // title 하이라이트
          let findKwd = document.querySelectorAll('.product__info--title, .product__info')
          findKwd.forEach(item => {
            let highlight = item.innerHTML
            highlight = highlight.replace(keyword,  `<span class="highlight">${keyword}</span>`)
            item.innerHTML = highlight
          })
          comma();
        })


        function nodata(){
          if(cartPrd.length == 0) {
            document.querySelector('.cart-moodal').classList.add('nodata');
            document.querySelector('.total-price__num').innerText = 0
            document.querySelector('.cart-product__list').insertAdjacentHTML('afterbegin', `
            <div class="nodata">
              <div class="nodata__contents">
                <p>장바구니가 비어있습니다.</p>
                <span>상품을 장바구니에 담아보세요.</span>
              </div>
            </div>
            `)
          }
        }

        function comma() {
          let priceNum = document.querySelectorAll('.price')
          for(let i = 0; i < priceNum.length; i++){
            priceNum[i].innerText = priceNum[i].innerText.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          }
        }


        var totalPrice = 0;
        function calc(){
          for(let i = 0;  i <  cartPrd.length; i++){
              let cartItem = document.querySelectorAll('.count__input')

              var cartPrdReverse = [...cartPrd].reverse();
              document.querySelectorAll('.count__btn--plus')[i].addEventListener('click', function(e){
                let targetPrice = cartPrdReverse[i]['price'];
                cartItem[i].value = ++cartItem[i].value
                cartPrdReverse[i]['count'] = cartItem[i].value

                totalPrice += parseInt(targetPrice)
                document.querySelector('.total-price__num').innerText = totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              })


              document.querySelectorAll('.count__btn--minus')[i].addEventListener('click', function(e){
                if(cartItem[i].value  > 1){
                  cartItem[i].value = --cartItem[i].value
                  cartPrdReverse[i]['count'] = cartItem[i].value
                  var targetPrice = cartPrdReverse[i]['price'];

                  totalPrice -= parseInt(targetPrice)
                  document.querySelector('.total-price__num').innerText = totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }else {
                  cartPrdReverse[i]['count'] = 1
                }
              })

            }
        }


        // 장바구니 상품 삭제
        function del(){
          var cartDel = document.querySelectorAll('.product__btn--del');
          var cartPrdReverse = [...cartPrd].reverse();
          for(let i = 0;  i < cartPrd.length; i++)
          cartDel[i].addEventListener('click', function(e){

            e.target.parentNode.remove();
            let prdId = e.target.dataset.id
            let prdIdx = cartPrd.findIndex(item => {return prdId == item.id})
            totalPrice -= parseInt(cartPrdReverse[i]['count'] * cartPrdReverse[i]['price'])
            cartPrd.splice(prdIdx, 1)
            document.querySelector('.total-price__num').innerText = totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            console.log(cartPrd)
            document.querySelector('.header__utill-count').innerText = cartPrd.length

            nodata();
          })
        }


        // 장바구니에 담기
        nodata();
        var cart = document.querySelectorAll('.product__btn--cart')
        document.querySelector('.header__utill-count').innerText = 0
        for(let i = 0; i < cart.length; i++){
          cart[i].addEventListener('click', function(e){
            let prdId = e.target.dataset.id
            let prdIdx = cartPrd.findIndex(item => {return prdId == item.id})

            if(prdIdx == -1) {
              document.querySelector('.cart-moodal').classList.remove('nodata')
              var addPrd = products.find(item => {return item.id == prdId} )
              cartPrd.push(addPrd)
              addPrd.count = 1
              document.querySelector('.header__utill-count').innerText = cartPrd.length
              totalPrice += parseInt(addPrd['price'])
              document.querySelector('.total-price__num').innerText = totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }

            document.querySelector('.cart-product__list').innerHTML = ''
            cartPrd.forEach(item => {
              document.querySelector('.cart-product__list').insertAdjacentHTML('afterbegin', `
                <div class="product__item">
                <div class="product__thumb">
                  <img src="./img/${item.photo}" alt="">
                </div>
                <div class="product__info">
                  <span class="product__info--brand">${item.brand}</span>
                  <p class="product__info--title">${item.title}</p>
                  <p class="product__info--price price">${item.price}</p>
                  <div class="product__info--count">
                      <button href="#" class="count__btn count__btn--minus" title="수량 빼기"><img src="http://simjuhye.com/portfolio/img/product_detail/minus_icon.png" alt="더하기"></button>
                      <input class="count__input" value=${item.count}>
                      <button href="#" class="count__btn count__btn--plus" title="수량 더하기"><img src="http://simjuhye.com/portfolio/img/product_detail/plus_icon.png" alt="빼기"></button>
                    </div>
                </div>
                <button class="product__btn--del" data-id=${item.id}></button>
              </div>
                `)

              })

              calc();
              del();
              comma();

            })

        }

        // 모달 관련 팝업
        let headCart = document.querySelector('.header__utill--cart')
        headCart.addEventListener('click', function(){
          document.querySelector('.cart-moodal').classList.add('on')
        })
        document.querySelector('.modal__btn--buy').addEventListener('click', function(){
          document.querySelector('.profile-moodal').classList.add('on')
        })
        // 닫기
        let modal = document.querySelectorAll('.modal')
        let closeBtn = document.querySelectorAll('.modal-head__btn--close')
        for(let i = 0; i < modal.length; i++){
          closeBtn[i].addEventListener('click', function(e){
            if(e.currentTarget !== 0){
              modal[i].classList.remove('on')
            }
            modal[i].classList.remove('on')
          })
        }

      })

  }

