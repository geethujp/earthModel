var Earth = Earth || {}

Earth.baseURL = '../assets/'

Earth.createEarth = function() {
    var geometry, material, mesh;
    geometry = new THREE.SphereGeometry(1, 32, 32)
    material = new THREE.MeshPhongMaterial({
        map: THREE.ImageUtils.loadTexture(Earth.baseURL + 'images/earthmap1k.jpg'),
        bumpMap: THREE.ImageUtils.loadTexture(Earth.baseURL + 'images/earthbump1k.jpg'),
        bumpScale: 0.05,
        specularMap: THREE.ImageUtils.loadTexture(Earth.baseURL + 'images/earthspec1k.jpg'),
        specular: new THREE.Color('grey'),
    })
    mesh = new THREE.Mesh(geometry, material)
    return mesh
}

Earth.createEarthCloud = function() {
    var canvasResult, contextResult, imageMap, geometry, material, mesh;

    // create destination canvas
    canvasResult = document.createElement('canvas')
    canvasResult.width = 1024
    canvasResult.height = 512
    contextResult = canvasResult.getContext('2d')

    // load earthcloudmap
    imageMap = new Image();
    imageMap.addEventListener("load", function() {
        var canvasMap, contextMap, dataMap, imageTrans;
        // create dataMap ImageData for earthcloudmap
        canvasMap = document.createElement('canvas')
        canvasMap.width = imageMap.width
        canvasMap.height = imageMap.height
        contextMap = canvasMap.getContext('2d')
        contextMap.drawImage(imageMap, 0, 0)
        dataMap = contextMap.getImageData(0, 0, canvasMap.width, canvasMap.height)

        // load earthcloudmaptrans
        imageTrans = new Image();
        imageTrans.addEventListener("load", function() {
            // create dataTrans ImageData for earthcloudmaptrans
            var canvasTrans, contextTrans, dataTrans, dataResult;
            canvasTrans = document.createElement('canvas')
            canvasTrans.width = imageTrans.width
            canvasTrans.height = imageTrans.height
            contextTrans = canvasTrans.getContext('2d')
            contextTrans.drawImage(imageTrans, 0, 0)
            dataTrans = contextTrans.getImageData(0, 0, canvasTrans.width, canvasTrans.height)
                // merge dataMap + dataTrans into dataResult
            dataResult = contextMap.createImageData(canvasMap.width, canvasMap.height)
            for (var y = 0, offset = 0, height = imageMap.height; y < height; y++) {
                for (var x = 0, width = imageMap.width; x < width; x++, offset += 4) {
                    dataResult.data[offset + 0] = dataMap.data[offset + 0]
                    dataResult.data[offset + 1] = dataMap.data[offset + 1]
                    dataResult.data[offset + 2] = dataMap.data[offset + 2]
                    dataResult.data[offset + 3] = 255 - dataTrans.data[offset + 0]
                }
            }
            // update texture with result
            contextResult.putImageData(dataResult, 0, 0)
            material.map.needsUpdate = true;
        })
        imageTrans.src = Earth.baseURL + 'images/earthcloudmaptrans.jpg';
    }, false);
    imageMap.src = Earth.baseURL + 'images/earthcloudmap.jpg';

    geometry = new THREE.SphereGeometry(1.01, 32, 32)
    material = new THREE.MeshPhongMaterial({
        map: new THREE.Texture(canvasResult),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
    })
    mesh = new THREE.Mesh(geometry, material)
    return mesh
}
