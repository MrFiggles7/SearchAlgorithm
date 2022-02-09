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
      <b-row>
        <b-col v-for="bestResult in this.bestResult" :key="bestResult.id">
          <b-card>
            <b-card-title style="width: 15rem">
              {{bestResult.name}}
            </b-card-title>
            <b-card-sub-title style="width: 15rem; font-size: .4rem">
              {{bestResult.description}}
            </b-card-sub-title>
            <b-card-text style="width: 15rem; font-size: .5rem">
              {{bestResult.address}}
            </b-card-text>
            <b-card-text style="width: 15rem; font-size: .5rem">
              {{bestResult.review}}
            </b-card-text>
            <b-card-text style="width: 15rem; font-size: .8rem">
              {{bestResult.type}}
            </b-card-text>
          </b-card>
        </b-col>
      </b-row>
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
      array: [],
      truncatedArray: [],
      searchArray: [],
      text: null,
      bestResult: [],

      searchAlgorithm: [],
    }
  },
  components: {},

  watch: {
    text: function (){
      this.bestResult = this.searchAlgorithm.Search(this.text, 20);
    }
  },

  methods: {

  },

  mounted() {

  },



  created() {

    var vm = this;
    let promises = [];
    for (let i = 0; i < 100; i++) {

      let baseURL = 'https://random-data-api.com/api/';


      promises.push(
          axios.get(baseURL + 'restaurant/random_restaurant').then(function (response) {
            vm.array.push(response.data);
          })
      );

    }

    Promise.all(promises).then(() => {
        this.searchAlgorithm = new SearchAlgorithm(this.array, ["name", 25], ["description", 10], ["address"], ["review"], ["type", 200]);
    }).then(() => {
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
