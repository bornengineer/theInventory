let app = Vue.createApp({
    data() {
        return {
            showSidebar: false,
            inventory: [],
            cart: {},
        };
    },
    computed: {
        totalQuantity() {
            return Object.values(this.cart).reduce((acc, curr) => {
                return acc + curr;
            }, 0);
        },
    },
    methods: {
        addToCart(name, index) {
            if (!this.cart[name]) {
                this.cart[name] = 0;
            }
            this.cart[name] += this.inventory[index].quantity;
            console.log(this.cart);
            this.inventory[index].quantity = 0;
        },
        toggleSidebar() {
            this.showSidebar = !this.showSidebar;
        },
        cartzero(name, index) {
            this.cart[name] = 0;
            console.log(this.cart);
        },
        removeItem(name) {
            delete this.cart[name];
        },
    },
    async mounted() {
        const res = await fetch("./food.json");
        const data = await res.json();
        this.inventory = data;
    },
});

app.component("ssidebar", {
    props: ["toggle", "cart", "inventory", "cartzero", "remove"],

    methods: {
        total() {
            // const names = Object.keys(this.cart)
            const total = Object.entries(this.cart).reduce((acc, curr, index) => {
                return acc + curr[1] * this.getPrice(curr[0]);
            }, 0);
            return total.toFixed(2);
            // const total = getPrice(name[index]) * this.cart
        },
        getPrice(name) {
            const product = this.inventory.find((p) => {
                return p.name === name;
            });
            return product.price.USD;
        },
    },

    template: `
    <aside class="cart-container">
      <div class="cart">
         <h1 class="cart-title spread">
          <span>
            Cart
            <i class="icofont-cart-alt icofont-1x"></i>
          </span>
          <button @click="toggle" class="cart-close">&times;</button>
        </h1>

        <div class="cart-body">
          <table class="cart-table">
            <thead>
              <tr>
                <th><span class="sr-only">Product Image</span></th>
                <th>Product</th>
                <th>Price</th>
                <th>&nbsp&nbsp&nbspQty</th>
                <th>Total</th>
                <th><span class="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(quantity, key, i) in cart" :key="i">
                <td><i class="icofont-{{name.icon}} icofont-3x"></i></td>
                <td>{{key}}</td>
                <td>\${{getPrice(key)}}</td>
                <td class="center">{{quantity}}</td>
                <td>\${{(quantity * getPrice(key)).toFixed(2)}}</td>
                <td class="center"><button @click="remove(key)" class="btn btn-light cart-remove">&times;</button></td>
             </tr>
             <br>
             </tbody>
             </table>
             <p v-if="!Object.keys(cart).length" class="center"><em>&nbsp&nbsp&nbsp&nbsp&nbsp&nbspNo items in cart</em></p>
            
             <tr class="row">
                    <td><div class="spread">
                                <span><strong>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspTotal:</strong> \${{total()}}</span>
                                <button class="btn btn-light">Checkout</button>&nbsp&nbsp&nbsp
                        </div>
                    </td>
              </tr>
                  

          <br>
            <br>
          
        </div>
      </div>
    </aside>
    `,
});
//   <p class="center"><em>{{}} items in cart</em></p>
// <div v-for="ttl , (quantity * getPrice(key)) in cart" class="spread">
//  <span><strong>Total:</strong> \${{}}</span>
//     <button class="btn btn-light">Checkout</button>
//   </div>
// <button class="btn btn-light cart-remove">& times;</button >
app.mount("#app");