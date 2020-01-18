<template>
  <v-content>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col class="text-center">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn :href="source" target="_blank" v-on="on" color="primary" fab x-large dark>
                <v-icon>mdi-camera</v-icon>
              </v-btn>
            </template>
            <span>Start camera</span>
          </v-tooltip>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>