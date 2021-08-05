// Typewriter
var char_idx = 0;
var is_deleting = false;
var words = ["Nicholas.", "a Maker.", "a Developer."]; 
var colors = ["#fd6a00", "#38bb00", "#8c52ff"];
var word_idx = 0;

function type_writer() {
  word_idx = word_idx % words.length;
  var cur_word = words[word_idx];
  document.getElementById("typewriter").style.background = colors[word_idx];
  var speed = 100; // speed in milliseconds

  if (is_deleting){
    speed /= 2;
    if(char_idx >= 0){
      document.getElementById("typewriter").innerHTML = cur_word.slice(0, char_idx);
      char_idx--;
      setTimeout(type_writer, speed);
    } else {
      is_deleting = false;
      word_idx++;
      setTimeout(type_writer, 1500);
    }
  } else {
    if (char_idx < cur_word.length) {
      document.getElementById("typewriter").innerHTML += cur_word.charAt(char_idx);
      char_idx++;
      setTimeout(type_writer, speed);
    } else {
      is_deleting = true;
      setTimeout(type_writer, 2000);
    }
  }
}

document.addEventListener('DOMContentLoaded', type_writer);