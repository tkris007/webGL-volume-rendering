var psTraceSrc = 
` 	

	precision highp float;
	
	varying vec3 viewDir;
	uniform vec3 eye;

	varying vec2 tex;


 uniform sampler2D volume;
	  
/*vec4 getSliceColor(vec4 point)
{
	float row = 16.0;
	float iRow = 1.0 / row;
	float width = 4096.0;
	float iWidth = 1.0 / width;
	float iSliceWidth = row * row * iWidth;

	float slice = floor(point.x / iRow / iRow);
	float slice2 = ceil(point.x / iRow / iRow);
	float rowIndex = floor(slice / row);
	float colIndex = slice - rowIndex * row;

	vec4 sample = texture2D(volume, vec2(colIndex * iSliceWidth + point.y * iSliceWidth,
	rowIndex * iSliceWidth + point.z * iSliceWidth));
	rowIndex = floor(slice2 / row);
	colIndex = slice2 - rowIndex * row;
	vec4 sample2 = texture2D(volume, vec2(colIndex * iSliceWidth + point.y * iSliceWidth,
	rowIndex * iSliceWidth + point.z * iSliceWidth));
	float a = point.x / iRow / iRow - slice;
	return vec4(sample.rgb * (a) + sample2.rgb * (1.0 - a), 1.0);
}

void main()
{
	vec4 d = vec4(normalize(viewDir), 0.0);
	vec4 e = vec4(eye, 1.0);
	vec4 color = vec4(0.5, 0.5, 0.5, 0.0);
	vec4 bPoint;
	vec4 tempColor;

	for(float i = 0.0; i < 2.0; i += 0.008)
	{
		vec4 point = e + i * d;
		if (point.x >= 0.0 && point.x <= 1.0
			&& point.y >= 0.0 && point.y <= 1.0
			&& point.z >= 0.0 && point.z <= 1.0
			&& color.a < 1.0)
		{
			bPoint = point;
			tempColor = getSliceColor(point);
			if (tempColor.r > 0.2)
			{
				color = tempColor;
			}
		}
	
	}

	if(color.a > 0.9)
	{
		vec4 dx1 = getSliceColor(vec4(bPoint.x - 0.008, bPoint.yzw));
		vec4 dx2 = getSliceColor(vec4(bPoint.x + 0.008, bPoint.yzw));
		vec4 dy1 = getSliceColor(vec4(bPoint.x, bPoint.y - 0.008, bPoint.zw));
		vec4 dy2 = getSliceColor(vec4(bPoint.x, bPoint.y + 0.008, bPoint.zw));
		vec4 dz1 = getSliceColor(vec4(bPoint.xy, bPoint.z - 0.008, bPoint.w));
		vec4 dz2 = getSliceColor(vec4(bPoint.xy, bPoint.z + 0.008, bPoint.w));

		vec4 normal = vec4(dx2.x-dx1.x, dy2.y-dy1.y, dz2.z - dz1.z, 0.0);
		gl_FragColor = vec4(color.rgb * dot(normal.xyz, d.xyz), 1.0);
	} else
	{
	gl_FragColor = vec4(color.rgb, 1.0);
	}
	
}*/	  
	/*  
	
	  
	float exitPoint()
	{
		return 1;
	}
	  
	float resample(vec3 intersectionPoint)
	{
		
	}
	  
	vec3 resampleGradient()
	{
	  
	}
	  
	vec3 shading(vec3 normal)
	{
	
	}
	*/		
/*vec3 RayCasting(vec3 pos, vec3 dir, float threshold)
{
	float t = entryPoint();
	float tmax = exitPoint();
	while(t < tmax)
	{
		vec3 sample = pos + dir * t;
		float density = resample(sample); // trilinear interpolation
		if(density > threshold)
		{
			vec3 gradient = resampleGradient();
			vec3 color = shading(gradient);
			return color;
		}  
		t++;
	}
	return vec3(0,0,0);
}

	*/
	vec2 intersectParams(vec3 boxPoint1, vec3 boxPoint2, vec3 eye, vec3 dir)
	{	
		float tmin = (boxPoint1.x - eye.x) / dir.x;
		float tmax = (boxPoint2.x - eye.x) / dir.x;

		if (tmin > tmax) 
		{
			float temp = tmin;
			tmin = tmax;
			tmax = temp;		
		}
		
		float tymin = (boxPoint1.y - eye.y) / dir.y;
		float tymax = (boxPoint2.y - eye.y) / dir.y;

		if (tymin > tymax) 
		{
			float temp = tymin;
			tymin = tymax;
			tymax = temp;		
		}
		
		if ((tmin > tymax) || (tymin > tmax)) 
		{
			return vec2(-1,-1);
		}
		
		if (tymin > tmin)  
		{
			tmin = tymin;
		}
		
		if (tymax < tmax)
		{
			tmax = tymax;
		}
		
		float tzmin = (boxPoint1.z - eye.z) / dir.z;
		float tzmax = (boxPoint2.z - eye.z) / dir.z;

		if (tzmin > tzmax) 
		{
			float temp = tzmin;
			tzmin = tzmax;
			tzmax = temp;				
		}

		if ((tmin > tzmax) || (tzmin > tmax))
		{
			return vec2(-1,-1);
		}
		
		if (tzmin > tmin)
		{
			tmin = tzmin;
		}
		if (tzmax < tmax)
		{
			tmax = tzmax; 
		}
		return vec2(tmin, tmax);
	}
     
	vec3 sliceSample(vec3 point, vec3 boundPoint1, vec3 boundPoint2)
	{
		
		
		float slice1 = floor((point.z-boundPoint1.z)*256.0/(boundPoint2.z-boundPoint1.z));
		float slice2 = ceil((point.z-boundPoint1.z)*256.0/(boundPoint2.z-boundPoint1.z));
		float rate = (point.z-boundPoint1.z)*256.0/(boundPoint2.z-boundPoint1.z) - slice1;
		vec2 tex256 = vec2(mod(slice1,float(16.0)), floor(slice1/float(16.0)))/16.0 + point.xy/16.0;
		vec4 sample1 = texture2D(volume, tex256);
		
		tex256 = vec2(mod(slice2,float(16.0)), floor(slice2/16.0))/16.0 + point.xy/16.0;
		vec4 sample2 = texture2D(volume, tex256);
		return sample1.xyz*rate + sample2.xyz*(1.0-rate);
	}
	 
void main() { 
	vec4 d = vec4(normalize(viewDir), 0.0);
	vec4 e = vec4(eye, 1.0);
	
	vec3 lightcolor = vec3(1,1,1);
	vec3 lightPos = vec3(4,4,4);
	
	vec3 boundPoint1 = vec3(0,0,3);
	vec3 boundPoint2 = vec3(1,1,4);
	vec2 t1t2 = intersectParams(boundPoint1,boundPoint2, e.xyz, d.xyz); 
	vec3 color = vec3(0,0,0);
	float t= t1t2.x;
	float dt = 0.008;
	for(int i = 0;i<1500;i++)
	{
		
		vec4 point = e+t*d;
		
		
		vec3 dx1 = sliceSample(point.xyz+vec3(+dt,0,0), boundPoint1, boundPoint2);
		vec3 dx2 = sliceSample(point.xyz+vec3(-dt,0,0), boundPoint1, boundPoint2);
		vec3 dy1 = sliceSample(point.xyz+vec3(0,+dt,0), boundPoint1, boundPoint2);
		vec3 dy2 = sliceSample(point.xyz+vec3(0,-dt,0), boundPoint1, boundPoint2);
		vec3 dz1 = sliceSample(point.xyz+vec3(0,0,+dt), boundPoint1, boundPoint2);
		vec3 dz2 = sliceSample(point.xyz+vec3(0,0,-dt), boundPoint1, boundPoint2);
		
		vec3 normal = normalize(vec3(dx1.x-dx2.x, dy1.y-dy2.y, dz1.z-dz2.z));
		
		vec3 lightDir = normalize(lightPos - point.xyz);
		
		float cosalpha = clamp( dot( normal,lightDir ), 0.0,1.0 );
		
		vec3 sample = sliceSample(point.xyz, boundPoint1, boundPoint2);
		color = sliceSample(point.xyz, boundPoint1, boundPoint2) * cosalpha * lightcolor;
		
		
		if (sample.r>0.3 || t>t1t2.y) break;
				
		t+=dt;
	}
	if (t1t2.x>0.0)
	{
		gl_FragColor = vec4(color.xyz,1.0);
	}
	else
	{

	gl_FragColor = vec4(0.5,0.5,0.5, 1);
	}
} 



`
;