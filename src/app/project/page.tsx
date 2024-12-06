"use client";

import { Canvas } from "@react-three/fiber";
import { Center, Environment, GradientTexture, GradientType, MeshReflectorMaterial, OrbitControls, Text3D } from "@react-three/drei";
import React, { useMemo, useState } from "react";
import { AlignHorizontalSpaceAround, BrickWall, Settings, TriangleRight } from "lucide-react";
import PanelAccordion from "@/components/elements/panel-accordion";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import MaterialSelect from "@/components/elements/material-select";
import { ColorPicker } from "@/components/ui/color-picker";
import { useCloseSidebar } from "@/lib/hooks";
import GradientMaterial from "@/components/elements/gradient-material";
import * as THREE from "three";

const InputComponent = ({ label, children, value, className }:
  { label: React.ReactNode, children?: React.ReactNode, value?: string | number, className?: string }
) => {
  return (
    <div className={cn("flex flex-col gap-1 w-full", className)}>
      <div className="flex items-center justify-between">
        <label>{label}</label>
        <div className="text-muted-foreground">{value}</div>
      </div>
      {children}
    </div>
  );
}

const Page = () => {
  const [controls, setControls] = useState({
    text: "hello\nworld",

    height: { min: 0.1, max: 10, step: 0.1, value: 0.1 },
    curveSegments: { min: 1, max: 32, step: 1, value: 16 },
    size: { min: 0.1, max: 10, step: 0.1, value: 1.5 },

    bevelEnabled: true,
    bevelOffset: { min: 0, max: 1, step: 0.01, value: 0 },
    bevelSegments: { min: 1, max: 32, step: 1, value: 16 },
    bevelSize: { min: 0, max: 1, step: 0.01, value: 0.25 },
    bevelThickness: { min: 0, max: 1, step: 0.01, value: 0.65 },

    lineHeight: { min: 0, max: 2, step: 0.01, value: 0.62 },
    letterSpacing: { min: -1, max: 1, step: 0.01, value: -0.04 },

    material: "Normal Material",
    color: "#ffffff",
    secondColor: "#ffaa00",
    roughness: { min: 0, max: 1, step: 0.01, value: 0.5 },
    metalness: { min: 0, max: 1, step: 0.01, value: 0.5 },
  });

  const material = useMemo(() => {
    switch (controls.material) {
      case "Normal Material":
        return <meshNormalMaterial />;
      case "Standard Material":
        return <meshStandardMaterial color={controls.color} metalness={controls.metalness.value} roughness={controls.roughness.value} />;
      case "Gradient Material":
        return <GradientMaterial color={controls.color} secondColor={controls.secondColor} />;
      case "Wireframe Material":
        return <meshBasicMaterial wireframe color={controls.color} />;
      case "Basic Material":
        return <meshBasicMaterial color={controls.color} />;
      default:
        return <meshNormalMaterial />;
    }
  }, [controls.material]);
  const materialComponent = useMemo(() => {
    return React.cloneElement(material, {
      color: controls.color,
      secondColor: controls.secondColor,
      roughness: controls.roughness.value,
      metalness: controls.metalness.value,
    });
  }, [material, controls.color, controls.secondColor, controls.roughness.value, controls.metalness.value]);

  useCloseSidebar();

  return (
    <div className="flex-1 max-h-[calc(100vh-52px)] w-full flex bg-muted dark:bg-white dark:bg-opacity-5 flex-col md:flex-row">
      <div className="min-w-[20%] max-w-[100%] overflow-scroll bg-background px-4 py-1 m-4 mr-0 rounded-md flex flex-col gap-2 items-center">
        <PanelAccordion title={<div className="cu-flex-center gap-2">
          <Settings className="w-4 h-4" />
          <label>
            General
          </label>
        </div>}
          opened
        >
          <div className="flex flex-col gap-4">
            <InputComponent label="Text">
              <Textarea value={controls.text} onChange={(e) => setControls({ ...controls, text: e.target.value })} />
            </InputComponent>
            <InputComponent label="Extrustion" value={controls.height.value}>
              <Slider min={0.1} max={10} step={0.1} defaultValue={[controls.height.value]}
                onValueChange={(value) => setControls({ ...controls, height: { ...controls.height, value: value[0] } })}
              />
            </InputComponent>
            <InputComponent label="Curve Segments" value={controls.curveSegments.value}>
              <Slider
                min={1}
                max={32}
                step={1}
                defaultValue={[controls.curveSegments.value]}
                onValueChange={(value) => setControls({ ...controls, curveSegments: { ...controls.curveSegments, value: value[0] } })}
              />
            </InputComponent>
            <InputComponent label="Size" value={controls.size.value}>
              <Slider
                min={0.1}
                max={10}
                step={0.1}
                defaultValue={[controls.size.value]}
                onValueChange={(value) => setControls({ ...controls, size: { ...controls.size, value: value[0] } })}
              />
            </InputComponent>
          </div>
        </PanelAccordion>

        <PanelAccordion title={<div className="cu-flex-center gap-2">
          <BrickWall className="w-4 h-4" />
          <label>
            Material
          </label>
        </div>}
        >
          <InputComponent label="Type">
            <MaterialSelect value={controls.material}
              onChange={(value) => setControls({ ...controls, material: value })}
            />
          </InputComponent>
          {material.props.color &&
            <InputComponent label="Color">
              <ColorPicker value={controls.color} onChange={(value) => setControls({ ...controls, color: value })} />
            </InputComponent>}
          {material.props.secondColor &&
            <InputComponent label="">
              <ColorPicker value={controls.secondColor} onChange={(value) => setControls({ ...controls, secondColor: value })} />
            </InputComponent>}
          {material.props.roughness &&
            <InputComponent label="Roughness" value={controls.roughness.value}>
              <Slider
                min={0}
                max={1}
                step={0.01}
                defaultValue={[controls.roughness.value]}
                onValueChange={(value) => setControls({ ...controls, roughness: { ...controls.roughness, value: value[0] } })}
              />
            </InputComponent>}
          {material.props.metalness &&
            <InputComponent label="Metalness" value={controls.metalness.value}>
              <Slider
                min={0}
                max={1}
                step={0.01}
                defaultValue={[controls.metalness.value]}
                onValueChange={(value) => setControls({ ...controls, metalness: { ...controls.metalness, value: value[0] } })}
              />
            </InputComponent>}
        </PanelAccordion>

        <PanelAccordion title={<div className="cu-flex-center gap-2">
          <TriangleRight className="w-4 h-4" />
          <label>
            Bevel
          </label>
        </div>}
        >
          <div className="flex flex-col gap-4">
            <InputComponent label="Enabled">
              <Switch checked={controls.bevelEnabled} onCheckedChange={(checked) => setControls({ ...controls, bevelEnabled: checked })} />
            </InputComponent>
            <InputComponent label="Offset" value={controls.bevelOffset.value}>
              <Slider
                min={0}
                max={1}
                step={0.01}
                defaultValue={[controls.bevelOffset.value]}
                onValueChange={(value) => setControls({ ...controls, bevelOffset: { ...controls.bevelOffset, value: value[0] } })}
              />
            </InputComponent>
            <InputComponent label="Segments" value={controls.bevelSegments.value}>
              <Slider
                min={1}
                max={32}
                step={1}
                defaultValue={[controls.bevelSegments.value]}
                onValueChange={(value) => setControls({ ...controls, bevelSegments: { ...controls.bevelSegments, value: value[0] } })}
              />
            </InputComponent>
            <InputComponent label="Size" value={controls.bevelSize.value}>
              <Slider
                min={0}
                max={1}
                step={0.01}
                defaultValue={[controls.bevelSize.value]}
                onValueChange={(value) => setControls({ ...controls, bevelSize: { ...controls.bevelSize, value: value[0] } })}
              />
            </InputComponent>
            <InputComponent label="Thickness" value={controls.bevelThickness.value}>
              <Slider
                min={0}
                max={1}
                step={0.01}
                defaultValue={[controls.bevelThickness.value]}
                onValueChange={(value) => setControls({ ...controls, bevelThickness: { ...controls.bevelThickness, value: value[0] } })}
              />
            </InputComponent>
          </div>

        </PanelAccordion>

        <PanelAccordion title={<div className="cu-flex-center gap-2">
          <AlignHorizontalSpaceAround className="w-4 h-4" />
          <label>
            Spacing
          </label>
        </div>}
        >
          <div className="flex flex-col gap-4">
            <InputComponent label="Line Height" value={controls.lineHeight.value}>
              <Slider
                min={0}
                max={2}
                step={0.01}
                defaultValue={[controls.lineHeight.value]}
                onValueChange={(value) => setControls({ ...controls, lineHeight: { ...controls.lineHeight, value: value[0] } })}
              />
            </InputComponent>
            <InputComponent label="Letter Spacing" value={controls.letterSpacing.value}>
              <Slider
                min={-1}
                max={1}
                step={0.01}
                defaultValue={[controls.letterSpacing.value]}
                onValueChange={(value) => setControls({ ...controls, letterSpacing: { ...controls.letterSpacing, value: value[0] } })}
              />
            </InputComponent>
          </div>
        </PanelAccordion>
      </div>

      <div className="h-[100%] min-h-[50vh] flex-1 p-4 overflow-hidden">
        <Canvas className="rounded-md bg-background">
          <Center key={JSON.stringify(controls)}>
            <Text3D
              height={controls.height.value}
              bevelOffset={controls.bevelOffset.value}
              bevelSegments={controls.bevelSegments.value}
              curveSegments={controls.curveSegments.value}
              bevelEnabled={controls.bevelEnabled}
              bevelSize={controls.bevelSize.value}
              bevelThickness={controls.bevelThickness.value}
              lineHeight={controls.lineHeight.value}
              letterSpacing={controls.letterSpacing.value}
              size={controls.size.value}
              font="/Inter_Bold.json"
            >
              {controls.text}
              {materialComponent}
            </Text3D>
          </Center>
          <Environment preset="sunset" />
          <OrbitControls makeDefault />
        </Canvas>
      </div>
    </div>
  );
};

export default Page;