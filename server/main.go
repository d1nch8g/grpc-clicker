package main

import (
	"context"
	"fmt"
	"log"
	"net"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/anypb"
	"google.golang.org/protobuf/types/known/emptypb"

	"github.com/Dancheg97/grpclicker_vscode/server/pb"
	"google.golang.org/grpc/reflection"
)

func main() {
	lis, err := net.Listen("tcp", ":12201")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()

	pb.RegisterBasicsServer(s, &server{})
	pb.RegisterConstructionsServer(s, &server{})
	pb.RegisterStreamsServer(s, &server{})

	reflection.Register(s)
	log.Printf("server listening at %v", lis.Addr())
	if err := s.Serve(lis); err != nil {
		panic(err)
	}
}

type server struct {
	pb.UnimplementedBasicsServer
	pb.UnimplementedConstructionsServer
	pb.UnimplementedStreamsServer
}

func (s *server) DoubleCall(ctx context.Context, in *pb.DoubleMes) (*pb.DoubleMes, error) {
	md, ok := metadata.FromIncomingContext(ctx)
	if ok {
		fmt.Println(md)
	}
	fmt.Println(ctx)
	fmt.Println(in)
	return in, nil
}

func (s *server) FloatCall(ctx context.Context, in *pb.FloatMes) (*pb.FloatMes, error) {
	time.Sleep(time.Second)
	fmt.Println(in)
	return in, nil
}

func (s *server) Int32Call(ctx context.Context, in *pb.Int32Mes) (*pb.Int32Mes, error) {
	fmt.Println(in)
	return in, nil
}

func (s *server) Int64Call(ctx context.Context, in *pb.Int64Mes) (*pb.Int64Mes, error) {
	fmt.Println(in)
	return in, nil
}

func (s *server) Uint32Call(ctx context.Context, in *pb.Uint32Mes) (*pb.Uint32Mes, error) {
	fmt.Println(in)
	return in, nil
}

func (s *server) Uint64Call(ctx context.Context, in *pb.Uint64Mes) (*pb.Uint64Mes, error) {
	fmt.Println(in)
	return in, nil
}

func (s *server) Sint32Call(ctx context.Context, in *pb.Sint32Mes) (*pb.Sint32Mes, error) {
	fmt.Println(in)
	return in, nil
}

func (s *server) Sint64Call(ctx context.Context, in *pb.Sint64Mes) (*pb.Sint64Mes, error) {
	fmt.Println(in)
	return in, nil
}

func (s *server) Fixed32Call(ctx context.Context, in *pb.Fixed32Mes) (*pb.Fixed32Mes, error) {
	fmt.Println(in)
	return in, nil
}

func (s *server) Fixed64Call(ctx context.Context, in *pb.Fixed64Mes) (*pb.Fixed64Mes, error) {
	fmt.Println(in)
	return in, nil
}

func (s *server) Sfixed32Call(ctx context.Context, in *pb.Sfixed32Mes) (*pb.Sfixed32Mes, error) {
	fmt.Println(in)
	return in, nil
}

func (s *server) Sfixed64Call(ctx context.Context, in *pb.Sfixed64Mes) (*pb.Sfixed64Mes, error) {
	fmt.Println(in)
	return in, nil
}

func (s *server) BoolCall(ctx context.Context, in *pb.BoolMes) (*pb.BoolMes, error) {
	md, ok := metadata.FromIncomingContext(ctx)
	if ok {
		fmt.Println(md)
	}
	fmt.Println(ctx)
	fmt.Println(in)
	return in, nil
}

func (s *server) StringCall(ctx context.Context, in *pb.StringMes) (*pb.StringMes, error) {
	fmt.Println(in)
	return in, nil
}

func (s *server) BytesCall(ctx context.Context, in *pb.BytesMes) (*pb.BytesMes, error) {
	fmt.Println(in)
	return in, nil
}

func (s *server) EnumCall(ctx context.Context, in *pb.EnumMes) (*pb.EnumMes, error) {
	fmt.Println(in)
	return in, nil
}

func (s *server) AnyCall(ctx context.Context, in *anypb.Any) (*anypb.Any, error) {
	fmt.Println(in)
	return in, nil
}

func (s *server) EmptyCall(ctx context.Context, in *emptypb.Empty) (*emptypb.Empty, error) {
	fmt.Println(`err`)
	return nil, status.Error(codes.AlreadyExists, `some err msg`)
}

func (s *server) ListCall(ctx context.Context, in *pb.ListMes) (*pb.ListMes, error) {
	fmt.Println(in)
	return in, nil
}

func (s *server) MapCall(ctx context.Context, in *pb.MapMes) (*pb.MapMes, error) {
	fmt.Println(in)
	return in, nil
}

func (s *server) OneofCall(ctx context.Context, in *pb.OneofMes) (*pb.OneofMes, error) {
	fmt.Println(in)
	return in, nil
}

func (s *server) OptionalCall(ctx context.Context, in *pb.OptionalMes) (*pb.OptionalMes, error) {
	fmt.Println(in)
	return in, nil
}

func (s *server) NestedCall(ctx context.Context, in *pb.NestedMes) (*pb.NestedMes, error) {
	fmt.Println(in)
	return in, nil
}
