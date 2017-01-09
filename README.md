# Angular Animation Counter

This project is an animated counter for Angularjs. The directive counts from one number to another over a duration. Unlike other projects this counts up and down automatically and requires fewer bindings.

## How to use angular count-to

Include the javascript file.

Apply the directive to a dom element.

```
 <span count-to="{{myNumber}}"></span>
```

This directive is smart and remembers the previous value for you

### Attributes

The following attributes can be set as numbers on the directive element.

- ```count-to```  the number to count to.
