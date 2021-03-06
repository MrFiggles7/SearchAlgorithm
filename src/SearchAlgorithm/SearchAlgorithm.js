import {stemmer} from "stemmer";
import stopwords from "@/SearchAlgorithm/stopwords";

function SearchAlgorithm(docArray = [], ...parameters) {


    this.Search = function (searchTerm = "", maxReturnValue = 5){
        searchTerm = stemWords(searchTerm);
        searchTerm = searchTerm.split(' ');
        let docRef = [];
        if(searchTerm.toString().length > 0){
            docRef = runComparison(searchTerm, maxReturnValue);
        }
        return docRef;
    }

    function runComparison(searchTerm = "", maxReturnValue = 5) {
        let refDocs = [];
        let bestTerms = [];

        docArray.forEach((arr) => {

            arr.searchIndex.forEach((term) => {

                if(term[0].includes(searchTerm)){
                    bestTerms.push({
                        term: term,
                        refDoc: arr,
                    })

                }
            })
        })

        bestTerms.sort((a,b) => b.term[1] - a.term[1]);
        bestTerms.forEach((term)=>{
            refDocs.push(term.refDoc)
        })

        return refDocs.slice(0, maxReturnValue) || null;

    }

    //Constructor parameters instantiated to usable properties
    // let searchableArray = [];

    let args = Array.prototype.slice.call(parameters)

    if(!Array.isArray(docArray) || docArray.length <= 0){
        throw new Error('docArray must be an array');
    }
    let parameterList = [];
    for (let i = 0; i < args.length; i++) {
        if (Array.isArray(args[i])) {
            parameterList.push({
                string: args[i][0],
                weight: args[i][1]
            })
        } else {
            parameterList.push({
                string: args[i]
            })
        }
    }
    // console.log(searchableArray);

    //Perform All Search Calculations
    //truncate all parameters to remove excess information
    truncateParameters();
    //reduce searchable index to key->value pair
    TF_IDF();
    //return final calculated values to searchable string format
    reformatSearchIndex();


    // Check to make sure all parameters are correct and run truncate function
    //on all document parameters
    function truncateParameters(){
        docArray.forEach((doc) => {
            doc.searchIndex = [];
            parameterList.forEach((parameter)=>{
                if(typeof doc[parameter.string] === 'string' || doc[parameter.string] instanceof String){
                    doc.searchIndex.push({
                        string : truncate(doc[parameter.string]),
                        weight : parameter.weight || null
                    });
                }
                else{
                    throw new Error('parameter must be a string');
                }
            })
        })
    }


    // Helper method, runs stemWord and removeStopWord functions and
    //returns result to truncateParameters to be pushed into the docArray searchIndex property
    function truncate(string) {
        string = stemWords(string);
        string = removeStopWords(string);
        console.log('variables truncated');
        return string;
    }

    //uses stemmer MIT Javascript Library to return string with stemmed words
    //https://github.com/words/stemmer
    function stemWords (string) {
        let newString = string.replace(/[^a-zA-Z0-9 ]/g, '');
        newString = string.split(/\s*[\s,.(){}+_=&^%$#@!'";:<>?/|\\-]\s*/);

        let stemString = [];
        newString.forEach((word) => {
            stemString.push(stemmer(word));
        })
        return stemString.join(' ');
    }

    //use imported stopword array to remove useless words
    function removeStopWords (string) {
        let res = [];
        let words = string.split(' ');
        for (let i = 0; i < words.length; i++) {
            if (!stopwords.includes(words[i])) {
                res.push(words[i])
            }
        }
        return res.join(' ');
    }

    //Helper method for calculating total (termFrequency * inverseDocumentFrequency) without weight
    function TF_IDF(){
        calculateTermFrequency();
        console.log('calculated term frequency');
        calculateInverseDocumentFrequency()
        console.log('calculated inverse document frequency');
        assignDocumentWeighting();
        console.log('assigned document weighting');
    }

    function calculateTermFrequency(){
        docArray.forEach((doc)=>{
            doc.searchIndex.forEach((index)=>{
                index.string = termFrequency(index.string);
            })
        })
    }

    function termFrequency(string) {

        let temp = string.split(' ');
        let returnArray = [];
        let count = [];
        temp.forEach((word) => {
            console.log('calculating term frequency')
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
    }

    function calculateInverseDocumentFrequency(){
        let truncatedArray = [];
        docArray.forEach((doc)=>{
            truncatedArray.push(doc.searchIndex);
        })
        truncatedArray = inverseDocumentFrequency(truncatedArray);
        for(let i = 0; i < truncatedArray.length; i++){
            docArray[i].searchIndex = truncatedArray[i]
        }
    }

    function inverseDocumentFrequency (docArray) {
        docArray.forEach((doc) => {
            let idf;
            let temp;
            let count = 0;

            doc.forEach((stringArr) => {
                console.log('calculating inverse document frequency')
                stringArr.string.forEach((term)=>{
                    temp = term[0]
                    docArray.forEach((doc) => {
                        doc.forEach((stringArr)=>{
                            if(stringArr.string.toString().includes(temp)){
                                count++;
                            }
                        })
                        // if (doc.includes(temp)) {
                        //     count++;
                        // }
                    })
                    idf = (Math.log(1+ (docArray.length) / count))
                    term[1] = term[1] * idf;
                    // console.log(term)
                    let index = stringArr.string.indexOf(term)
                    docArray[docArray.indexOf(doc)][doc.indexOf(stringArr)].string[index] = term;
                })

            })

        })
        return docArray;
    }

    function assignDocumentWeighting(){
        docArray.forEach((doc)=>{
            doc.searchIndex.forEach((stringArr)=>{
                let weight;
                if(stringArr.weight != null || stringArr.weight !== 0){
                    weight = stringArr.weight || 0;
                }
                else{
                    weight = 0
                }

                stringArr.string.forEach((string)=>{
                    string[1] = string[1] * (1 + (weight * .01));
                })
            })
        })
    }

    function reformatSearchIndex(){
        docArray.forEach((doc)=>{
            let newStringArr = [];
            doc.searchIndex.forEach((stringArr)=>{
                stringArr.string.forEach((string)=>{
                    newStringArr.push(string);
                })

            })
            doc.searchIndex = newStringArr;
        })
        console.log('Ready to search!');
    }

    return this;
}

export default SearchAlgorithm;