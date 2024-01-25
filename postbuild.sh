#!/bin/sh

exec sed -i 's/document.baseURI/location.origin /g' .output/public/_nuxt/worker-*.js
