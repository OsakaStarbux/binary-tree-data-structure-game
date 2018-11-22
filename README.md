A Pen created at CodePen.io. You can find this one at https://codepen.io/KevinBradley/pen/GwpxjY.

 This game is an experiment with binary trees to store, search and change railway tracks and switches. Railway tracks can branch and those branches can branch so Tree data structures are a better fit for storing them than, say, heavily nested arrays. 
 
 My use case requires each railway line to have 0, 1 or 2 branches. The branches will be represented by child nodes. There needs to be one start node and one destination node. Track switching choices will be made in between. There will be many leaf nodes besides the destination, which represent dead ends.
