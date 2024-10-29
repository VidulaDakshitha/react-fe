import { imageProps } from '../../types/core';
import './Image.scss';

import React from 'react';

const ImageComponent = ({ alt, src, className }:imageProps) => {
  return <img className={className} src={src} alt={alt} />;
};

export default ImageComponent;
