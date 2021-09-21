import * as DICTIONARY from './dictionary.js'

// Set the URL below to the path of the model.json file you uploaded.
const MODEL_JSON_URL = '/tfjs-spam-detection/model.json'
// Set the minimum confidence for spam comments to be flagged.
// Remember this is a number from 0 to 1, representing a percentage
// So here 0.75 == 75% sure it is spam.
const SPAM_THRESHOLD = 0.75

// The number of input elements the ML Model is expecting.
const ENCODING_LENGTH = 20

class Sphamlet {
  constructor () {
    this.model = null
  }

  async loadModel () {
    this.model = await window.tf.loadLayersModel(MODEL_JSON_URL)
  }

  /**
  * Function that takes an array of words, converts words to tokens,
  * and then returns a Tensor representation of the tokenization that
  * can be used as input to the machine learning model.
  */
  tokenize (wordArray) {
  // Always start with the START token.
    const returnArray = [DICTIONARY.START]

    // Loop through the words in the sentence you want to encode.
    // If word is found in dictionary, add that number else
    // you add the UNKNOWN token.
    for (var i = 0; i < wordArray.length; i++) {
      const encoding = DICTIONARY.LOOKUP[wordArray[i]]
      returnArray.push(encoding === undefined ? DICTIONARY.UNKNOWN : encoding)
    }

    // Finally if the number of words was < the minimum encoding length
    // minus 1 (due to the start token), fill the rest with PAD tokens.
    while (i < ENCODING_LENGTH - 1) {
      returnArray.push(DICTIONARY.PAD)
      i++
    }

    // Log the result to see what you made.
    // console.log([returnArray])

    // Convert to a TensorFlow Tensor and return that.
    return window.tf.tensor([returnArray])
  }

  async predict (input) {
    const lowercaseSentenceArray = input.toLowerCase().replace(/[^\w\s]/g, ' ').split(' ')
    // const inputTensor = window.tf.tensor([[1, 3, 12, 18, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]])
    const inputTensor = this.tokenize(lowercaseSentenceArray)
    const results = await this.model.predict(inputTensor)
    const data = await results.data()
    console.log(data)
    const isSpam = data[1] > SPAM_THRESHOLD
    return isSpam
  }
}

export { Sphamlet }
