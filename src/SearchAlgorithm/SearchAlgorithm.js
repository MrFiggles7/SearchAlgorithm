// import {stemmer} from "stemmer";
// import stopwords from "@/stopwords";

function SearchAlgorithm() {

    this.setDocumentReference = function (/**/) {
        let args = Array.prototype.slice.call(arguments)
        var obj = args[0];

        let searchableStrings = [];
        for (var i = 1; i < args.length; i++) {
            if (Array.isArray(args[i])) {
                searchableStrings.push({
                    string: args[i][0],
                    weight: args[i][1]
                })
            } else {
                searchableStrings.push({
                    string: args[i]
                })
            }
        }
        console.log(obj);
        console.log(searchableStrings)

        // let truncatedArrays = [];
    };




    // function truncate(string) {
    //     string = stemWords(string);
    //     string = removeStopWords(string);
    //     string = termFrequency(string);
    //
    //     return string;
    // }
    //
    // function stemWords (string) {
    //     let newString = string.replace(/[^a-zA-Z0-9 ]/g, '');
    //     newString = string.split(/\s*[\s,.(){}+_=&^%$#@!'";:<>?/|\\-]\s*/);
    //
    //     let stemString = [];
    //     newString.forEach((word) => {
    //         stemString.push(stemmer(word));
    //     })
    //     return stemString.join(' ');
    // }
    //
    // function removeStopWords (string) {
    //     let res = [];
    //     let words = string.split(' ');
    //     for (let i = 0; i < words.length; i++) {
    //         if (!stopwords.includes(words[i])) {
    //             res.push(words[i])
    //         }
    //     }
    //     return res.join(' ');
    // }
    //
    // function termFrequency(string) {
    //     let temp = string.split(' ');
    //     let returnArray = [];
    //     let count = [];
    //     temp.forEach((word) => {
    //         let regex = new RegExp(word, 'g')
    //         count = string.match(regex)
    //         if (count.length !== 0 && !returnArray.includes(word)) {
    //             count = [count[0], count.length];
    //             returnArray.push(count)
    //         }
    //     })
    //
    //     returnArray.forEach((word) => {
    //         word[1] = word[1] / returnArray.length;
    //     })
    //
    //     return returnArray;
    // }
    //
    // function inverseDocumentFrequency (docArray) {
    //     docArray.forEach((doc) => {
    //         let idf;
    //         let temp;
    //         let count = 0;
    //
    //         doc.forEach((term) => {
    //
    //             temp = term[0]
    //             docArray.forEach((doc) => {
    //                 if (doc.includes(temp)) {
    //                     count++;
    //                 }
    //             })
    //             idf = Math.log((docArray.length) / (1 + count))
    //             term[1] = term[1] * idf;
    //             // console.log(term)
    //             let index = doc.indexOf(term)
    //             docArray[docArray.indexOf(doc)][index] = term;
    //             // console.log(docArray[docArray.indexOf(doc)][index])
    //         })
    //
    //     })
    //     return docArray;
    // }

    return this;
}

export default SearchAlgorithm;