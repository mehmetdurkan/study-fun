// Daily STAAR questions for Mina (grade 4). One per day, shown by assets/staar.js at the end of her pages.
// Original questions written in the STAAR formats (multiple choice, "select TWO", type-in, Part A/Part B),
// one TEKS each. Add new days at the END. Fields: see assets/staar.js.
window.STAAR_ITEMS = [
{id:'m1118', date:'2026-11-18', subject:'math', teks:'4.2B', level:'easy', type:'mc',
 q:'Which shows 40,306 in expanded notation?',
 o:['40,000 + 300 + 6','4,000 + 300 + 6','40,000 + 3,000 + 6','400 + 30 + 6'], a:0,
 why:'40,306 has a 4 in the ten-thousands place (40,000), a 0 in the thousands place, a 3 in the hundreds place (300), a 0 in the tens place and a 6 in the ones place.'},

{id:'r1119', date:'2026-11-19', subject:'reading', teks:'4.3B', level:'easy', type:'mc',
 title:'The Long Trail',
 passage:'The hikers had climbed since sunrise. By noon, their legs ached and their backpacks felt like bricks. They were so weary that they sat down on a fallen log and did not move for a long time.',
 q:'What does the word weary mean in this paragraph?',
 o:['Excited','Very tired','Lost','Hungry'], a:1,
 why:'Clues: their legs ached, the packs felt like bricks, and they sat without moving. Those details show they were very tired.'},

{id:'m1120', date:'2026-11-20', subject:'math', teks:'4.4D', level:'challenge', type:'multi',
 q:'A school orders 6 boxes of markers. Each box has 24 markers. Which TWO expressions can be used to find the total number of markers? Select TWO correct answers.',
 o:['6 × 24','(6 × 20) + (6 × 4)','6 + 24','24 − 6','(6 × 2) + (6 × 4)'], a:[0,1],
 why:'6 groups of 24 is 6 × 24 = 144. Breaking 24 into 20 + 4 gives (6 × 20) + (6 × 4) = 120 + 24 = 144. The last choice uses 2 instead of 20, so it is too small.'},

{id:'r1121', date:'2026-11-21', subject:'reading', teks:'4.8A', level:'challenge', type:'ab',
 title:'Leo’s Garden', numbered:true,
 passage:'Leo pushed six bean seeds into the soil and waited.\nA week went by, and nothing came up. Leo poked the dirt with his finger. It was dry and hard, like a cracker.\n“I forgot to water them,” he groaned.\nThat night, Leo made a chart and taped it to the fridge. Every morning he watered the pot and drew a check mark.\nTen days later, two tiny green loops pushed up through the soil. Leo smiled and drew a star next to his check marks.',
 parts:[
  {q:'What lesson does Leo learn in the story?',
   o:['Gardens are too hard for kids.','Taking care of something every day helps it grow.','Seeds grow best without any help.','Charts are more fun than plants.'], a:1},
  {q:'Which sentence from the story best supports the answer to Part A?',
   o:['Leo pushed six bean seeds into the soil and waited.','It was dry and hard, like a cracker.','Every morning he watered the pot and drew a check mark.','Leo smiled and drew a star next to his check marks.'], a:2}
 ],
 why:'Leo’s seeds only sprouted after he watered them every day. The sentence about watering every morning shows the lesson best.'},

{id:'m1122', date:'2026-11-22', subject:'math', teks:'4.4A', level:'easy', type:'entry',
 q:'The library had 3,425 books. It got 1,580 new books. How many books does the library have now? Type your answer.',
 a:'5005',
 why:'3,425 + 1,580: 5 + 0 = 5 ones, 2 + 8 = 10 tens (write 0, carry 1), 4 + 5 + 1 = 10 hundreds (write 0, carry 1), 3 + 1 + 1 = 5 thousands. The answer is 5,005.'},

{id:'r1123', date:'2026-11-23', subject:'reading', teks:'4.11D', level:'easy', type:'mc',
 q:'Read this sentence from a student’s story: “Me and my sister walks to school every day.” What is the correct way to write this sentence?',
 o:['My sister and I walk to school every day.','Me and my sister walk to school every day.','My sister and me walks to school every day.','I and my sister walks to school every day.'], a:0,
 why:'Use “I” when you are doing the action, and name the other person first: “My sister and I.” Two people means the verb is “walk,” not “walks.”'},

{id:'m1124', date:'2026-11-24', subject:'math', teks:'4.3D', level:'challenge', type:'mc',
 q:'Which comparison is true?',
 o:['3/4 < 2/3','5/8 > 1/2','2/6 > 1/2','4/10 = 1/2'], a:1,
 why:'Compare each fraction to 1/2. Half of 8 is 4, so 5/8 is more than 1/2. 3/4 is bigger than 2/3, 2/6 is less than 1/2, and 4/10 is less than 5/10.'},

{id:'r1125', date:'2026-11-25', subject:'reading', teks:'4.9D', level:'easy', type:'mc',
 title:'Armored Diggers',
 passage:'Nine-banded armadillos live all across Texas. Their backs are covered with hard, bony plates that work like armor. Armadillos have strong claws for digging up insects to eat. When they need to cross a stream, they can hold their breath for about six minutes and walk along the bottom.',
 q:'What is the central idea of this paragraph?',
 o:['Armadillos have special body parts that help them survive.','Armadillos live only near streams.','Armadillos eat mostly plants.','Armadillos cannot get across water.'], a:0,
 why:'Every detail (the armor, the digging claws, holding their breath) shows a body part or skill that helps armadillos survive.'},

{id:'m1126', date:'2026-11-26', subject:'math', teks:'4.5D', level:'challenge', type:'entry',
 q:'A garden is shaped like a rectangle. It is 9 feet long and 4 feet wide. What is the perimeter of the garden in feet? Type your answer.',
 a:'26',
 why:'Perimeter is the distance around: 9 + 4 + 9 + 4 = 26 feet. (Area would be 9 × 4 = 36 square feet, a different question.)'},

{id:'m1127', date:'2026-11-27', subject:'math', teks:'4.2G', level:'challenge', type:'multi',
 q:'Which TWO numbers have the same value as 7/10? Select TWO correct answers.',
 o:['0.7','0.07','70/100','7.10'], a:[0,2],
 why:'7/10 means seven tenths, which is written 0.7. Seven tenths is the same as seventy hundredths, 70/100. 0.07 is only seven hundredths.'}
];
