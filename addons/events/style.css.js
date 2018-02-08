export default scope => `<style>
  .logger-event-btn {
    background-color: white;
    border-radius: 5px;
    border: 1px solid ${scope.color};
    color: ${scope.color};
    display: inline-block;
    font-family: "Open Sans", sans-serif;
    font-size: 12px;
    font-weight: 700;
    height: 30px;
    line-height: 30px;
    margin-right: 5px;
    padding-left: 20px;
    padding-right: 20px;
    transition: all ${scope.duration}ms;
  }
  .logger-event-btn.fired {
    background-color: ${scope.animatedStateColor};
    border: 1px solid ${scope.animatedStateColor};
    color: white;
  }
  .clear-button {
    border-color: red;
    color: red;
    float: right;
    height: auto;
  }
  #events-data {
    list-style: none;
    padding: 0;
    display: table;
  }
  #events-data li {
    display: table-row;
  }
  #events-data .info{
    padding: 5px;
    display: table-cell;
    vertical-align: top;
    font-family:Inconsolata, Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New;
  }
  #events-data .info .label{
    color: #999;
  }
  #events-data .info .label:after{
    /* (Un)comment following line to show/hide a colon after the grey label */
    /* content: ':'; */
  }
  #events-data .info .value{
    color: #555;
  }
  #events-data .info.info-event .value{
    color: purple;
  }
  #events-data .info.info-data .value{
    color: #219bc6;
  }
  </style>
`;
