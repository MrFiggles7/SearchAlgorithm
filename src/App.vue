<template>
  <div id="app">
    <div>
      <b-icon icon="search" scale="1.2" class="me-3 ms-2"></b-icon>
      <b-form-input
          ref="searchInput"
          style="border: none; width: auto; font-size: 1.2rem; position: relative; z-index: 2000"
          class="d-inline"
          v-model="text"

          placeholder="Search">
      </b-form-input>
      <b-container>
        <b-row>
          <b-col cols="6" v-for="bestResult in this.bestResult" :key="bestResult.id">
            <b-card>
              <b-card-title style="width: 15rem">
                {{ bestResult.name }}
                <!--                {{ bestResult.business_name }}-->
              </b-card-title>
              <b-card-sub-title style="width: 15rem; font-size: .4rem">
                {{ bestResult.description }}
                <!--                {{ bestResult.bs_company_statement }}-->
              </b-card-sub-title>
              <b-card-text style="width: 15rem; font-size: .5rem">
                {{ bestResult.address }}
                <!--                {{ bestResult.catch_phrase }}-->
              </b-card-text>
              <b-card-text style="width: 15rem; font-size: .5rem">
                {{ bestResult.review }}
                <!--                {{ bestResult.buzzword }}-->
              </b-card-text>
              <b-card-text style="width: 15rem; font-size: .8rem">
                {{ bestResult.type }}
                <!--                {{ bestResult.industry }}-->
              </b-card-text>
            </b-card>
          </b-col>
        </b-row>
      </b-container>

    </div>
  </div>
</template>

<script>
import axios from 'axios';
import SearchAlgorithm from "@/SearchAlgorithm/SearchAlgorithm";

export default {
  name: 'App',

  data() {
    return {
      restaurantArray: [],
      businessArray: [],
      truncatedArray: [],
      searchArray: [],
      text: null,
      bestResult: [],
      restaurantSearchAlgorithm: [],
      businessSearchAlgorithm: [],
    }
  },
  components: {},

  watch: {
    text: function (){
      // this.bestResult = this.businessSearchAlgorithm.Search(this.text);
      this.bestResult = this.restaurantSearchAlgorithm.Search(this.text);
    }
  },

  methods: {
  },

  mounted() {
  },


  created() {
    let vm = this;
    let promises = [];
    for (let i = 0; i < 100; i++) {
      let baseURL = 'https://random-data-api.com/api/';
      promises.push(
          // axios.get(baseURL + 'company/random_company').then(function (response) {
          //   vm.businessArray.push(response.data);
          // })

          axios.get(baseURL + 'restaurant/random_restaurant').then(function (response) {
            vm.restaurantArray.push(response.data);
          })


      )


    }
    Promise.all(promises).then(() => {
      this.restaurantSearchAlgorithm =
          new SearchAlgorithm(
              this.restaurantArray,
              ["name", 10],
              ["description", 10],
              ["address"],
              ["review"],
              ["type", 50]);
      // this.businessSearchAlgorithm =
      //     new SearchAlgorithm(
      //         this.businessArray,
      //         ["business_name"],
      //         ["bs_company_statement"],
      //         ["catch_phrase"],
      //         ["buzzword"],
      //         ["industry"]);

    })
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
