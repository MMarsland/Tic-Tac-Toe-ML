# Tic-Tac-Toe-ML

**--ARCHIVED--**

Tic-Tac-Toe-ML was created as a means for me to learn about the Minimax Machine Learning algorithm.

I believe I followed along with The Coding Train for this project so credit to them for the tutorial and probably many snippets of code I copied along the way.
If you'd like to follow along with them as well here is the video:
https://www.youtube.com/watch?v=trKjYdBASyQ&ab_channel=TheCodingTrain

This project is in a completed state and the algorithm is able to never lose. However, minimax does not account for the posibility for the opponent to make mistakes so the AI doesn't always make the best moves for it to win against an imperfect opponent but that is a problem for another project and another algorithm! See if you can not lose against this unbeatable AI. Enjoy!

I believe I also experimented with the method of Q-Learning though a successful AI was never created by this method. The Q-Learner is initally hidden but can be played against by pressing "q" on your keyboard. Pressing "m" will return the game to Minimax.

## Development / Testing

The game was written in HTML so that it can be opened in Google Chrome and run. If you wish to continue development, simple clone or download the repository and open "main.html" in Google Chrome (Other web browsers may work but aren't necessarily supported).

Although the demonstration is in a completed state more work could be done to improve the user interface. The project could also utalize the minimax functions written to play other games for future projects.

Future work: 
- Improve Minimax to take advantage of suboptial oppoents by breaking ties by re-evaluating based on less than optimal opponent moves,
https://stackoverflow.com/questions/20577034/how-could-a-minimax-algorithm-be-more-optimistic
- Complete the Q-Learner to be trainable and functional

## Example

![alt text](minimax-tic-tac-toedemo.gif "Demonstration of Minimax-tic-tac-toe (GIF)")