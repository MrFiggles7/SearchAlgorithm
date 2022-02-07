<template>
  <div id="app">
    <div>
      <b-icon icon="search" scale="1.2" class="me-3 ms-2"></b-icon>
      <b-form-input
          ref="searchInput"
          style="border: none; width: auto; font-size: 1.2rem; position: relative; z-index: 2000"
          class="d-inline"
          v-model="text"
          v-on:keyup="Search"
          placeholder="Search">
      </b-form-input>
      <b-card>
<!--        <b-card-title style="width: 15rem">-->
<!--          {{bestResult.name}}-->
<!--        </b-card-title>-->
<!--        <b-card-sub-title style="width: 15rem">-->
<!--          {{bestResult.description}}-->
<!--        </b-card-sub-title>-->
<!--        <b-card-text style="width: 15rem">-->
<!--          {{bestResult.address}}-->
<!--        </b-card-text>-->
<!--        <b-card-text style="width: 15rem">-->
<!--          {{bestResult.review}}-->
<!--        </b-card-text>-->
<!--        <b-card-text style="width: 15rem">-->
<!--          {{bestResult.type}}-->
<!--        </b-card-text>-->
      </b-card>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import {stemmer} from 'stemmer';
import stopwords from "@/stopwords";
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
    }
  },
  components: {},

  methods: {
    Search: function () {
      let searchTerm = this.stemWords(this.text);
      searchTerm = searchTerm.split(' ');
      if (searchTerm.toString().length > 3) {
        this.runComparison(searchTerm);
      }
    },

    runComparison: function (searchTerm) {

      let bestTerm;
      let refDoc;
      let highestTermScore = 0;
      let previousTermScore = 0;
      let refDocs = [];

      console.log(searchTerm)

      this.searchArray.forEach((arr) => {

        arr.calculatedArray.forEach((term) => {

          if(term[0].includes(searchTerm) && term[1] > highestTermScore){
            highestTermScore = term[1];
            bestTerm = term;
            refDocs.push(arr);
          }
          else if(term[0].includes(searchTerm) && term[1] < highestTermScore && term[1] > previousTermScore){
            previousTermScore = term[1];
            refDocs.push(arr);
          }
        })
      })


      console.log(bestTerm);
      console.log(refDoc)
      this.bestResult = refDocs || null;

    },


    termFrequency: function (string) {
      let temp = string.split(' ');
      let returnArray = [];
      let count = [];
      temp.forEach((word) => {
        let regex = new RegExp(word, 'g')
        count = string.match(regex)
        if (count.length !== 0 && !returnArray.includes(word)) {
          count = [count[0], count.length];
          returnArray.push(count)
        }
      })

      returnArray.forEach((word) => {
        word[1] = word[1] / returnArray.length;
      })

      return returnArray;
    },

    inverseDocumentFrequency: function (docArray) {
      docArray.forEach((doc) => {
        let idf;
        let temp;
        let count = 0;

        doc.forEach((term) => {

          temp = term[0]
          docArray.forEach((doc) => {
            if (doc.includes(temp)) {
              count++;
            }
          })
          idf = Math.log((docArray.length) / (1 + count))
          term[1] = term[1] * idf;
          // console.log(term)
          let index = doc.indexOf(term)
          docArray[docArray.indexOf(doc)][index] = term;
          // console.log(docArray[docArray.indexOf(doc)][index])
        })

      })
      return docArray;
    },


    truncate: function (string) {
      string = this.stemWords(string);
      string = this.removeStopWords(string);
      string = this.termFrequency(string);

      return string;
    },

    stemWords: function (string) {
      let newString = string.replace(/[^a-zA-Z0-9 ]/g, '');
      newString = string.split(/\s*[\s,.(){}+_=&^%$#@!'";:<>?/|\\-]\s*/);

      let stemString = [];
      newString.forEach((word) => {
        stemString.push(stemmer(word));
      })
      return stemString.join(' ');
    },

    removeStopWords: function (string) {
      let res = [];
      let words = string.split(' ');
      for (let i = 0; i < words.length; i++) {
        if (!stopwords.includes(words[i])) {
          res.push(words[i])
        }
      }
      return res.join(' ');
    },
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

      let term;


      this.array.forEach((item) => {

        // let truncatedAddress = this.truncate(item.address);
        // let truncatedDescription = this.truncate(item.description);
        // let truncatedReview = this.truncate(item.review);


        let concat = item.address.concat(item.description);
        concat = concat.concat(item.review)
        concat = concat.concat(item.name)
        concat = concat.concat(item.type)

        term = this.truncate(concat);
        // let temp = this.truncate(item.description)
        // termFrequency = termFrequency.concat(temp)
        // temp = termFrequency.concat(this.truncate(item.review));
        // termFrequency = termFrequency.concat(temp)


        vm.truncatedArray.push(term);

      })
      vm.truncatedArray = this.inverseDocumentFrequency(vm.truncatedArray);
      for(let i = 0; i < vm.truncatedArray.length; i++){
        vm.searchArray.push(
            {
              address: vm.array[i].address,
              description: vm.array[i].description,
              hours: vm.array[i].hours,
              id: vm.array[i].id,
              logo: vm.array[i].logo,
              name: vm.array[i].name,
              phone_number: vm.array[i].phone_number,
              review: vm.array[i].review,
              type: vm.array[i].type,
              uid: vm.array[i].uid,
              calculatedArray: vm.truncatedArray[i],
            }
        );
      }
    }).then(() => {
      // this.inverseDocumentFrequency();
      let searchAlgorithm = new SearchAlgorithm();
      searchAlgorithm.setDocumentReference(this.array, ["name", 25], ["description", 10], ["address"], ["review"]);

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
