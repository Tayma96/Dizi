import { useThree } from "@react-three/fiber";
import * as THREE from "three";

/** Kamerayı her karede ayarlar (konum, hedef, görüş açısı, yatırma). */
export const CameraRig: React.FC<{ pos: [number, number, number]; target: [number, number, number]; fov?: number; roll?: number }> = ({ pos, target, fov = 50, roll = 0 }) => {
  const { camera } = useThree();
  const cam = camera as THREE.PerspectiveCamera;
  cam.position.set(pos[0], pos[1], pos[2]);
  cam.up.set(Math.sin(roll), Math.cos(roll), 0);
  cam.lookAt(target[0], target[1], target[2]);
  if (cam.fov !== fov) {
    cam.fov = fov;
    cam.updateProjectionMatrix();
  }
  return null;
};
