export default function HDRTest() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-80">
        <div className="grid grid-cols-2 gap-2">
          <h1 className="text-lg font-semibold">HDR Test</h1>
          <div />
          <div className="bg-white h-20 w-full text-black p-2 rounded-md">
          </div>
          <div className="bg- backdrop-bri h-20 w-full text-black rounded-md overflow-hidden">
            <video width="640" height="200" poster="white.b07b762e.png"
              preload="" autoPlay loop muted controls={false}
              className="h-full w-full object-cover" title="HDR Video">
              <source src="https://kidi.ng/wanna-see-a-whiter-white/white1.6805bac8.webm" type="video/webm" className="h-full w-full object-cover" />
              <source src="https://kidi.ng/wanna-see-a-whiter-white/white1.52879896.mp4" type="video/mp4" className="h-full w-full object-cover" />
              <source src="https://kidi.ng/wanna-see-a-whiter-white/white2.ec8e015a.mp4" type="video/mp4" className="h-full w-full object-cover" />
              Turn on JavaScript to see the video.
            </video>
          </div>
          <div>
            white
          </div>
          <div>
            whiter than white
          </div>
        </div>
      </div>
    </div>
  )
}