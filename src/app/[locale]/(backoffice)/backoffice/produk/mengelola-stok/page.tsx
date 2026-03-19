import React, { FC } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProductTransfer from "./produk-transfer";
import ProductOpname from "./produk-opname";

interface StokPageProps {
    
}
 
const StokPage: FC<StokPageProps> = () => {
    return ( 
        <div className="container mx-auto py-10">
                <Tabs defaultValue="productTransfer">
                    <TabsList className="grid grid-cols-2">
                        <TabsTrigger value="productTransfer" className="data-[state=active]:bg-primary data-[state=active]:text-white p-2">Product Transfer</TabsTrigger>
                        <TabsTrigger value="productOpname" className="data-[state=active]:bg-primary data-[state=active]:text-white p-2" >Product Opname</TabsTrigger>
                    </TabsList>
                    <TabsContent value="productTransfer">
                        <ProductTransfer />
                    </TabsContent>
                    <TabsContent value="productOpname">
                        <ProductOpname />
                    </TabsContent>
                </Tabs>

            </div>
     );
}
 
export default StokPage;