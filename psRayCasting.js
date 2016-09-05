var psRayCastSrc = 
` 	

	precision highp float;
	
	varying vec3 viewDir;
	uniform vec3 eye;

	varying vec2 tex;


 uniform sampler2D volume;
	  

	/*  
	  
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
	vec3 boundPoint1 = vec3(0,0,3);
	vec3 boundPoint2 = vec3(1,1,4);
	vec2 t1t2 = intersectParams(boundPoint1,boundPoint2, e.xyz, d.xyz); 
	vec3 color = vec3(0,0,0);
	float t= t1t2.x;
	float dt = 0.016;
	float P =1.0;
	for(int i = 0;i<500;i++)
	{		
		vec4 point = e+t*d;
		float density = sliceSample(point.xyz, boundPoint1, boundPoint2).r;
		
		
		if (density>0.001){ 
		
		
		color += density*20.0*dt*P*0.06 ;// * dot(normal, d.xyz);
		
		if (P<0.001 || t>t1t2.y) break;
		
		P*=pow(density, dt);	

		}
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