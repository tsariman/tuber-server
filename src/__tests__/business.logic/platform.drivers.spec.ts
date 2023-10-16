import fix_missing_annotation_data from '../../business.logic/platform.drivers'

describe('fix_missing_annotation_data', () => {
  it('should return undefined if no annotation is provided', async () => {
    const result = await fix_missing_annotation_data()
    expect(result).toBeUndefined()
  })

  it('should return the same annotation if the platform is not rumble', async () => {
    const annotation = {
      videoid: '',
      start_seconds: 0,
      title: 'test the return of the same annotation',
      platform: 'youtube',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    }
    const result = await fix_missing_annotation_data(annotation)
    expect(result).toEqual(annotation)
  })

  it('should return the same annotation with videoid added if the platform is rumble and videoid can be parsed from the url', async () => {
    const annotation = {
      videoid: '',
      start_seconds: 0,
      title: 'test the return of the same annotation',
      platform: 'rumble',
      url: 'https://rumble.com/vk8z5t-adorable-baby-elephant-learns-to-use-its-trunk.html'
    }
    const mockResponse = {
      text: jest.fn().mockResolvedValue(`
        <html>
          <body>
            <script>
              window.__INITIAL_STATE__ = {
                "video":"123456"
              }
            </script>
          </body>
        </html>
      `)
    }
    jest.spyOn(global, 'fetch').mockResolvedValueOnce(mockResponse as any)
    const result = await fix_missing_annotation_data(annotation)
    expect(result).toEqual({
      ...annotation,
      videoid: '123456'
    })

  })

  it('should return undefined and log an error if the platform is rumble and videoid cannot be parsed from the url', async () => {
    const annotation = {
      videoid: '',
      start_seconds: 0,
      title: 'test the return of the same annotation',
      platform: 'rumble',
      url: 'https://rumble.com/vk8z5t-adorable-baby-elephant-learns-to-use-its-trunk.html'
    }
    const mockResponse = {
      text: jest.fn().mockResolvedValue(`
        <html>
          <body>
            <script>
              window.__INITIAL_STATE__ = {
                "foo":"bar"
              }
            </script>
          </body>
        </html>
      `)
    }
    jest.spyOn(global, 'fetch').mockResolvedValueOnce(mockResponse as any)
    const mockError = jest.spyOn(console, 'error').mockImplementationOnce(() => {})
    const result = await fix_missing_annotation_data(annotation)
    expect(result).toBeUndefined()
    expect(mockError).toHaveBeenCalledWith('failed to parse video ID from rumble url', [])
  })
})
