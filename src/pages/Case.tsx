
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  Image,
  FileText,
  Save,
  Microscope,
  Fingerprint,
  Trash2,
  Camera,
  BarChart3,
  PanelLeft,
  Eye,
  Share,
  FileUp,
  ArrowUpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function Case() {
  const { caseId } = useParams();
  const [activeTab, setActiveTab] = useState("upload");
  const [caseName, setCaseName] = useState(
    "Case #" + caseId?.replace("case-", "")
  );
  const [caseDescription, setCaseDescription] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [showCaseInfo, setShowCaseInfo] = useState(true);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [];

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newImages.push(e.target.result.toString());
            
            // If this is the last file, update state
            if (newImages.length === files.length) {
              setUploadedImages([...uploadedImages, ...newImages]);
              toast({
                title: "Upload Successful",
                description: `Uploaded ${files.length} image${files.length !== 1 ? "s" : ""}.`,
              });
            }
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleAnalyzeImages = () => {
    if (uploadedImages.length === 0) {
      toast({
        variant: "destructive",
        title: "No Images",
        description: "Please upload at least one image to analyze.",
      });
      return;
    }

    toast({
      title: "Analysis Started",
      description: "Your images are being analyzed. This may take a moment.",
    });

    // Simulate analysis time
    setTimeout(() => {
      toast({
        title: "Analysis Complete",
        description: "Your images have been analyzed. View the report for details.",
      });
      setActiveTab("report");
    }, 3000);
  };

  const handleDeleteImage = (index: number) => {
    const newImages = [...uploadedImages];
    newImages.splice(index, 1);
    setUploadedImages(newImages);
    
    toast({
      title: "Image Deleted",
      description: "The image has been removed from your case.",
    });
  };

  const handleSaveCase = () => {
    toast({
      title: "Case Saved",
      description: "Your case has been saved successfully.",
    });
  };

  const toggleCaseInfo = () => {
    setShowCaseInfo(!showCaseInfo);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <div className="flex-1 container py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <Link to="/dashboard" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-2">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold">{caseName}</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={toggleCaseInfo}>
              {showCaseInfo ? <PanelLeft className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showCaseInfo ? "Hide Details" : "Show Details"}
            </Button>
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 mr-1" />
              Share
            </Button>
            <Button size="sm" onClick={handleSaveCase}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Case Info Sidebar */}
          {showCaseInfo && (
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-card p-4 rounded-lg border">
                <h2 className="text-lg font-medium mb-4">Case Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium" htmlFor="case-name">
                      Case Name
                    </label>
                    <Input
                      id="case-name"
                      value={caseName}
                      onChange={(e) => setCaseName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium" htmlFor="case-description">
                      Case Description
                    </label>
                    <Textarea
                      id="case-description"
                      value={caseDescription}
                      onChange={(e) => setCaseDescription(e.target.value)}
                      className="mt-1"
                      rows={5}
                      placeholder="Enter case details..."
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Case ID</p>
                    <p className="text-sm text-muted-foreground">{caseId}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Created</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card p-4 rounded-lg border">
                <h2 className="text-lg font-medium mb-4">Forensic Tools</h2>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Microscope className="h-4 w-4 mr-2" />
                    Evidence Analysis
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Fingerprint className="h-4 w-4 mr-2" />
                    Pattern Recognition
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Image Enhancement
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Data Visualization
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Main Content */}
          <div className={`${showCaseInfo ? "lg:col-span-9" : "lg:col-span-12"}`}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="upload">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Evidence
                </TabsTrigger>
                <TabsTrigger value="analyze">
                  <Microscope className="h-4 w-4 mr-2" />
                  Analyze
                </TabsTrigger>
                <TabsTrigger value="report">
                  <FileText className="h-4 w-4 mr-2" />
                  Report
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="mt-6">
                <div className="bg-card p-6 rounded-lg border">
                  <h2 className="text-xl font-medium mb-4">Upload Crime Scene Images</h2>
                  
                  <div className="border-2 border-dashed rounded-lg p-8 text-center mb-6">
                    <FileUp className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      Drag and drop images, or browse files
                    </p>
                    <Input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                    />
                    <label htmlFor="file-upload">
                      <Button variant="secondary" className="gap-1" asChild>
                        <span>
                          <ArrowUpCircle className="h-4 w-4 mr-1" />
                          Select Files
                        </span>
                      </Button>
                    </label>
                  </div>
                  
                  {uploadedImages.length > 0 && (
                    <>
                      <h3 className="text-lg font-medium mb-2">Uploaded Images</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {uploadedImages.length} image{uploadedImages.length !== 1 ? "s" : ""} ready for analysis
                      </p>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {uploadedImages.map((src, index) => (
                          <div key={index} className="group relative aspect-square rounded-md border overflow-hidden">
                            <img
                              src={src}
                              alt={`Uploaded image ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <Button
                                variant="destructive"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleDeleteImage(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6">
                        <Button onClick={() => setActiveTab("analyze")} disabled={uploadedImages.length === 0}>
                          Continue to Analysis
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="analyze" className="mt-6">
                <div className="bg-card p-6 rounded-lg border">
                  <h2 className="text-xl font-medium mb-2">Analyze Evidence</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Our AI will process your uploaded images to identify key evidence and patterns.
                  </p>
                  
                  {uploadedImages.length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h3 className="text-lg font-medium mb-4">Analysis Options</h3>
                          <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="option-blood"
                                className="h-4 w-4 rounded border-gray-300"
                                defaultChecked
                              />
                              <label htmlFor="option-blood" className="text-sm">
                                Blood Pattern Analysis
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="option-fingerprints"
                                className="h-4 w-4 rounded border-gray-300"
                                defaultChecked
                              />
                              <label htmlFor="option-fingerprints" className="text-sm">
                                Fingerprint Detection
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="option-objects"
                                className="h-4 w-4 rounded border-gray-300"
                                defaultChecked
                              />
                              <label htmlFor="option-objects" className="text-sm">
                                Object Recognition
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="option-footprints"
                                className="h-4 w-4 rounded border-gray-300"
                                defaultChecked
                              />
                              <label htmlFor="option-footprints" className="text-sm">
                                Footprint Analysis
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="option-weapon"
                                className="h-4 w-4 rounded border-gray-300"
                                defaultChecked
                              />
                              <label htmlFor="option-weapon" className="text-sm">
                                Weapon Identification
                              </label>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-4">Evidence Preview</h3>
                          <div className="grid grid-cols-2 gap-2">
                            {uploadedImages.slice(0, 4).map((src, index) => (
                              <div key={index} className="aspect-square rounded-md border overflow-hidden">
                                <img
                                  src={src}
                                  alt={`Evidence ${index + 1}`}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            ))}
                            {uploadedImages.length > 4 && (
                              <div className="aspect-square rounded-md border overflow-hidden bg-muted flex items-center justify-center">
                                <span className="text-muted-foreground">
                                  +{uploadedImages.length - 4} more
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <Separator className="my-6" />
                      
                      <div className="flex justify-between">
                        <Button variant="outline" onClick={() => setActiveTab("upload")}>
                          Back to Upload
                        </Button>
                        <Button onClick={handleAnalyzeImages}>
                          <Microscope className="h-4 w-4 mr-2" />
                          Start Analysis
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <Image className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-medium mb-2">No Images Uploaded</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Please upload images in the previous step before proceeding with analysis.
                      </p>
                      <Button variant="outline" onClick={() => setActiveTab("upload")}>
                        Go to Upload
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="report" className="mt-6">
                <div className="bg-card p-6 rounded-lg border">
                  <h2 className="text-xl font-medium mb-2">Forensic Analysis Report</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    AI-generated report based on the evidence provided.
                  </p>
                  
                  {uploadedImages.length > 0 ? (
                    <div className="space-y-6">
                      <div className="p-4 bg-muted rounded-md">
                        <h3 className="text-lg font-medium mb-2">Executive Summary</h3>
                        <p className="text-sm">
                          The analysis of the provided crime scene images reveals several key findings. The evidence suggests a forced entry through the rear entrance, with multiple fingerprints detected on the door handle and window frame. Blood pattern analysis indicates a struggle occurred in the main area, with directional spatter consistent with a medium-velocity impact. Several objects of interest have been identified and cataloged for further investigation.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-4">Evidence Analysis</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="border rounded-md p-4">
                            <h4 className="text-md font-medium mb-2">Fingerprint Analysis</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              4 distinct fingerprint patterns identified
                            </p>
                            <div className="aspect-video bg-black rounded-md flex items-center justify-center mb-2">
                              <span className="text-white text-xs">Fingerprint visualization image</span>
                            </div>
                            <ul className="text-sm list-disc list-inside">
                              <li>2 prints match database records</li>
                              <li>2 unidentified prints preserved for comparison</li>
                              <li>Highest quality print found on door handle</li>
                            </ul>
                          </div>
                          
                          <div className="border rounded-md p-4">
                            <h4 className="text-md font-medium mb-2">Blood Pattern Analysis</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              Medium-velocity impact spatter identified
                            </p>
                            <div className="aspect-video bg-black rounded-md flex items-center justify-center mb-2">
                              <span className="text-white text-xs">Blood pattern visualization</span>
                            </div>
                            <ul className="text-sm list-disc list-inside">
                              <li>Directionality suggests origin point near window</li>
                              <li>Cast-off pattern indicates swinging motion</li>
                              <li>Transfer stains found on doorknob</li>
                            </ul>
                          </div>
                          
                          <div className="border rounded-md p-4">
                            <h4 className="text-md font-medium mb-2">Object Recognition</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              12 significant objects identified
                            </p>
                            <div className="aspect-video bg-black rounded-md flex items-center justify-center mb-2">
                              <span className="text-white text-xs">Object recognition results</span>
                            </div>
                            <ul className="text-sm list-disc list-inside">
                              <li>Potential weapon identified (kitchen knife)</li>
                              <li>Displaced furniture consistent with struggle</li>
                              <li>Foreign object (unidentified tool) near entry point</li>
                            </ul>
                          </div>
                          
                          <div className="border rounded-md p-4">
                            <h4 className="text-md font-medium mb-2">Footprint Analysis</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              3 distinct footprint patterns identified
                            </p>
                            <div className="aspect-video bg-black rounded-md flex items-center justify-center mb-2">
                              <span className="text-white text-xs">Footprint visualization</span>
                            </div>
                            <ul className="text-sm list-disc list-inside">
                              <li>Size 11 men's athletic shoe (primary suspect)</li>
                              <li>Size 8 women's shoe (likely victim)</li>
                              <li>Partial print of work boot near rear entrance</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-4">Recommendations</h3>
                        <ul className="space-y-2">
                          <li className="p-3 bg-muted rounded flex items-start">
                            <div className="mr-2 mt-0.5 text-forensic">
                              <Fingerprint className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium">Submit unidentified fingerprints for extended database search</p>
                              <p className="text-sm text-muted-foreground">High-quality prints may yield matches in expanded criminal databases.</p>
                            </div>
                          </li>
                          <li className="p-3 bg-muted rounded flex items-start">
                            <div className="mr-2 mt-0.5 text-forensic">
                              <Microscope className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium">Collect DNA samples from blood evidence</p>
                              <p className="text-sm text-muted-foreground">Blood patterns indicate multiple sources; DNA analysis recommended to identify individuals.</p>
                            </div>
                          </li>
                          <li className="p-3 bg-muted rounded flex items-start">
                            <div className="mr-2 mt-0.5 text-forensic">
                              <Camera className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium">Enhanced imaging of partial footprint</p>
                              <p className="text-sm text-muted-foreground">The partial work boot print requires advanced enhancement techniques for better identification.</p>
                            </div>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="flex justify-between">
                        <Button variant="outline" onClick={() => setActiveTab("analyze")}>
                          Back to Analysis
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button>
                              <Save className="h-4 w-4 mr-2" />
                              Generate Full Report
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Report Generated</DialogTitle>
                              <DialogDescription>
                                Your forensic analysis report has been generated successfully.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                              <p className="text-center text-muted-foreground">
                                The complete report is now available for download or sharing.
                              </p>
                            </div>
                            <DialogFooter>
                              <Button variant="outline">Share Report</Button>
                              <Button>Download PDF</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-medium mb-2">No Report Available</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Please upload and analyze images before generating a report.
                      </p>
                      <Button variant="outline" onClick={() => setActiveTab("upload")}>
                        Go to Upload
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
