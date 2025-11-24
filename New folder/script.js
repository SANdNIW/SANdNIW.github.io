const compassContainer = document.getElementById('compass-container');
const startBtn = document.getElementById('start-btn');
const debugInfo = document.getElementById('debug-info');

let isCompassActive = false;

startBtn.addEventListener('click', () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        // iOS 13+ requires permission
        DeviceOrientationEvent.requestPermission()
            .then(response => {
                if (response === 'granted') {
                    startCompass();
                } else {
                    alert('Permission denied. Unable to access compass.');
                }
            })
            .catch(console.error);
    } else {
        // Non-iOS 13+ devices
        startCompass();
    }
});

function startCompass() {
    isCompassActive = true;
    startBtn.style.display = 'none'; // Hide button after starting
    window.addEventListener('deviceorientation', handleOrientation);
}

function handleOrientation(event) {
    let heading = 0;

    if (event.webkitCompassHeading) {
        // iOS
        heading = event.webkitCompassHeading;
    } else if (event.alpha !== null) {
        // Android / Others (alpha is 0 at North usually, but can vary)
        // Note: 'alpha' is the rotation around z-axis. 
        // 0 is North if absolute is true, but implementation varies.
        // We'll assume standard behavior where alpha increases counter-clockwise?
        // Actually, alpha is 0 when device top points North.
        // It increases as you rotate left (counter-clockwise).
        // So heading (clockwise from North) = 360 - alpha.

        // However, on some devices, alpha is relative to initial position.
        // We try to use 'absolute' property if available, but it's tricky.
        // For a simple demo, we'll use alpha directly.
        heading = 360 - event.alpha;
    }

    // Update debug info
    debugInfo.textContent = `Heading: ${Math.round(heading)}°`;

    // Rotate the map
    // If I am facing North (0 deg), the map should be upright (0 deg).
    // If I turn East (90 deg), the map should rotate -90 deg so North is still pointing North relative to the world?
    // Wait.
    // If the phone points North, the map's North (top) should point to the phone's top.
    // If the phone points East, the map's North should point to the phone's Left (West).
    // So the map needs to rotate COUNTER-CLOCKWISE by the heading amount.

    // Example:
    // Heading 0 (North) -> Rotate 0.
    // Heading 90 (East) -> The "North" of the map should be at -90 degrees (Left).
    // So Rotation = -Heading.

    compassContainer.style.transform = `rotate(${-heading}deg)`;
}

// Fallback for desktop testing (optional)
// If no device orientation support, maybe allow mouse drag?
// For now, we just stick to the requirement.
