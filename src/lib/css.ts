declare namespace React {
  interface CSSProperties {
    [ key: `--${ string }` ]: string | number
  }
}
// allows custom variables to be used in style prop
//   without typescript error, 
//   e.g.style = {{ "--my-var": "value" }}