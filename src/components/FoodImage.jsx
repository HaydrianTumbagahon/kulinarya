import { useState } from 'react'

function FoodImage({ src, alt, className = '', imageClassName = '', style }) {
  const [failed, setFailed] = useState(false)

  return (
    <div className={`relative overflow-hidden bg-navy ${className}`} style={style}>
      {!failed && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover ${imageClassName}`}
        />
      )}
    </div>
  )
}

export default FoodImage
