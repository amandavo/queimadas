var southWest = L.latLng(-85, -180);
var northEast = L.latLng(85, 180);
var bounds = L.latLngBounds(southWest, northEast);

var map = L.map('map', {
    maxBounds: bounds, 
    maxBoundsViscosity: 1.0
}).setView([-15.78, -47.93], 4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 3,
    attribution: '© OpenStreetMap'
}).addTo(map);

var coordsControl = L.control({ position: 'bottomright' });

coordsControl.onAdd = function () {
    var div = L.DomUtil.create('div', 'coords-control');
    div.style.backgroundColor = 'white';
    div.style.padding = '6px';
    div.style.borderRadius = '4px';
    div.style.fontSize = '12px';
    div.style.display = 'none';
    return div;
};

coordsControl.addTo(map);

function toDMS(coord) {
    const absCoord = Math.abs(coord);
    const degrees = Math.floor(absCoord);
    const minutes = Math.floor((absCoord - degrees) * 60);
    const seconds = ((absCoord - degrees - minutes / 60) * 3600).toFixed(2);
    const direction = coord >= 0 ? (coord === absCoord ? 'N' : 'E') : (coord === -absCoord ? 'S' : 'W');
    return `${degrees}° ${minutes}' ${seconds}" ${direction}`;
}

map.on('mousemove', function (e) {
    var lat = e.latlng.lat.toFixed(5);
    var lng = e.latlng.lng.toFixed(5);
    var latDMS = toDMS(e.latlng.lat);
    var lngDMS = toDMS(e.latlng.lng);
    var coordsDiv = document.querySelector('.coords-control');
    coordsDiv.style.display = 'block';
    coordsDiv.innerHTML = `${lat}, ${lng}<br>${latDMS}, ${lngDMS}`;
});

map.on('mouseout', function () {
    var coordsDiv = document.querySelector('.coords-control');
    coordsDiv.style.display = 'none';
});

fetch('/api/focos10min')
    .then(response => response.json())
    .then(data => {
        var fireIcon = L.divIcon({
            html: '<i class="bi bi-fire fire-anim" style="font-size: 20px;"></i>',
            className: 'custom-fire-icon'
        });
        L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, { icon: fireIcon });
            },
            onEachFeature: function (feature, layer) {
                const props = feature.properties;
                const html = `
                        <b>Satélite:</b> ${props.satelite}<br>
                        <b>Data:</b> ${props.data}<br>
                        <b>Latitude:</b> ${props.lat}<br>
                        <b>Longitude:</b> ${props.lon}
                    `;
                layer.bindPopup(html);
            }
        }).addTo(map);
    });