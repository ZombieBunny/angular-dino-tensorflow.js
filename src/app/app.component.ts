import { Component, OnInit } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import { Runner } from '../game';
import { CANVAS_WIDTH } from '../game/constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  public runner = null;
  public firstTime = true;

  constructor() {
    this.firstTime = false;
  }

  ngOnInit() {
    this.setup();
  }

  public setup() {
    // Initialize the game Runner.
    this.runner = new Runner('.game', {
      DINO_COUNT: 1,
      onReset: this.handleReset,
      onCrash: this.handleCrash,
      onRunning: this.handleRunning
    });
    // Set runner as a global variable if you need runtime debugging.
    // window.runner = runner;
    // Initialize everything in the game and start the game.
    this.runner.init();
  }

  public handleReset(dinos) {
    console.log('reset', dinos, this.firstTime);
    // running this for single dino at a time
    // console.log(dinos);

    const dino = dinos[0];
    // if the game is being started for the first time initiate
    // the model and compile it to make it ready for training and predicting
    if (!this.firstTime) {
      this.firstTime = true;

      // creating a tensorflow sequential model
      dino.model = tf.sequential();

      /* 
      adding the first hidden layer to the model using with 3 inputs ,
      sigmoid activation function
      and output of 6
      */
      dino.model.add(tf.layers.dense({
        inputShape: [3],
        activation: 'sigmoid',
        units: 6
      }));

      /* this is the second output layer with 6 inputs coming from the previous hidden layer
      activation is again sigmoid and output is given as 2 units 10 for not jump and 01 for jump
      */
      dino.model.add(tf.layers.dense({
        inputShape: [6],
        activation: 'sigmoid',
        units: 2
      }));

      /* compiling the model using meanSquaredError loss function and adam
      optimizer with a learning rate of 0.1 */
      dino.model.compile({
        loss: 'meanSquaredError',
        optimizer: tf.train.adam(0.1)
      });

      // object which will containn training data and appropriate labels
      dino.training = {
        inputs: [],
        labels: []
      };

    } else {
      // Train the model before restarting.
      // log into console that model will now be trained
      console.info('Training');
      // convert the inputs and labels to tensor2d format and  then training the model
      console.info(tf.tensor2d(dino.training.inputs), dino.training.inputs, dino.training.labels);
      dino.model.fit(tf.tensor2d(dino.training.inputs), tf.tensor2d(dino.training.labels));
    }
  }

  public handleRunning(dino, state) {
    // console.log('running');
    return new Promise((resolve) => {
      if (!dino.jumping) {
        // whenever the dino is not jumping decide whether it needs to jump or not
        let action = 0; // variable for action 1 for jump 0 for not
        // call model.predict on the state vector after converting it to tensor2d object
        const _state = state ? [
          state.obstacleX / CANVAS_WIDTH,
          state.obstacleWidth / CANVAS_WIDTH,
          state.speed / 100
        ] : [0, 0, 0];

        console.log('predict', _state);
        const prediction = dino.model.predict(tf.tensor2d([_state]));

        // the predict function returns a tensor we get the data in a promise as result
        // and based on result decide the action
        const predictionPromise = prediction.data();

        predictionPromise.then((result) => {
          console.log('result', result);
          // converting prediction to action
          if (result[1] > result[0]) {
            // we want to jump
            action = 1;
            // set last jumping state to current state
            dino.lastJumpingState = state;
          } else {
            // set running state to current state
            dino.lastRunningState = state;
          }
          resolve(action);
        }, error => {
          console.log(error);
        });
      } else {
        resolve(0);
      }
    });
  }

  public handleCrash(dino) {
    let input = null;
    let label = null;
    if (dino.jumping) {
      input = dino.lastJumpingState ? [
        dino.lastJumpingState.obstacleX / CANVAS_WIDTH,
        dino.lastJumpingState.obstacleWidth / CANVAS_WIDTH,
        dino.lastJumpingState.speed / 100
      ] : [0, 0, 0];
      label = [1, 0];
    } else {
      input = dino.lastRunningState ? [
        dino.lastRunningState.obstacleX / CANVAS_WIDTH,
        dino.lastRunningState.obstacleWidth / CANVAS_WIDTH,
        dino.lastRunningState.speed / 100
      ] : [0, 0, 0];
      label = [0, 1];
    }
    dino.training.inputs.push(input);
    dino.training.labels.push(label);
  }

}
